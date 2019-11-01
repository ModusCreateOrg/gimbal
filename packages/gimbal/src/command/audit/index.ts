import { finishSpinner, startSpinner } from '@modus/gimbal-core/lib/logger';
import findPort from '@modus/gimbal-core/lib/utils/port';
import Queue from '@modus/gimbal-core/lib/utils/Queue';
import Chrome from '@/module/chrome';
import Serve from '@/module/serve';

import { Report, ReportItem } from '@/typings/command';
import { AuditObject } from '@/typings/command/audit';
import { Context } from '@/typings/context';

import {
  addSpinners,
  didAuditPass,
  findBuildDir,
  getModulesToRun,
  isModuleBrowserable,
  isRouteLocal,
  isRoutesLocal,
  normalizeAudits,
  setCapabilities,
} from './utils';

// register built-in modules
import '@/module/heap-snapshot/register';
import '@/module/lighthouse/register';
import '@/module/size/register';
import '@/module/unused-source/register';

interface AuditOptions {
  chrome?: Chrome;
  url: string;
}

const doAudit = async (options: AuditOptions, audits: AuditObject, context: Context): Promise<Report> => {
  const rets: ReportItem[] = [];
  let success = true;

  await Promise.all(
    Object.keys(audits).map(async (name: string) => {
      const auditConfig = audits[name];
      const { module: moduleName } = auditConfig;
      const mod = context.module.get(moduleName);

      if (!mod) {
        finishSpinner(name, false, `"${moduleName}" was not found in the module registry`);

        throw new Error(`"${mod}" was not found in the module registry`);
      }

      startSpinner(name);

      const report = await mod({
        ...options,
        config: auditConfig,
        context,
      });

      if (report) {
        if (!report.success) {
          success = false;
        }

        if (report.data) {
          rets.push(...report.data);
        }
      }

      const succeed = didAuditPass(report);

      finishSpinner(name, succeed);
    }),
  );

  return {
    data: rets,
    success,
  };
};

const audit = async (context: Context): Promise<Report | Report[]> => {
  const audits: AuditObject = normalizeAudits(context.config.get('audits'));

  if (context.config.get('configs.calculateUnusedSource') === false) {
    audits['unused-source'].disabled = true;
  }

  if (context.config.get('configs.heapSnapshot') === false) {
    audits['heap-snapshot'].disabled = true;
  }

  if (context.config.get('configs.lighthouse') === false) {
    audits.lighthouse.disabled = true;
  }

  if (context.config.get('configs.size') === false) {
    audits.size.disabled = true;
  }

  // set the audits onto config in case any were spliced above
  context.config.set('audits', audits);

  // only need one audit to be browserable to know
  const modulesBrowserable = isModuleBrowserable(context);
  // only need one route to be local to know
  const hasLocalRoute = isRoutesLocal(context);

  let buildDir: string | void;
  let chrome: Chrome | undefined;
  let servePort: number | undefined;
  let serve: Serve | undefined;

  if (hasLocalRoute) {
    // only need a build dir if we have a local route
    buildDir = await findBuildDir(context);

    if (!buildDir) {
      throw Error('Could not find a build directory. Make sure the application is built');
    }

    context.config.set('configs.buildDir', buildDir);
  }

  if (modulesBrowserable) {
    if (hasLocalRoute) {
      // only need to start a local server if we have a local route
      servePort = await findPort();
      serve = new Serve({ port: servePort, public: buildDir as string });
    }

    chrome = new Chrome();
  }

  if (serve) {
    await serve.start();
  }

  if (chrome) {
    await chrome.launch();
  }

  // will disable any enabled audits that shouldn't be enabled
  // based on capabilities detected.
  setCapabilities(
    audits,
    {
      browserable: modulesBrowserable,
      hasLocalRoute,
    },
    context,
  );

  const routes = context.config.get('configs.route');
  const queue = new Queue();

  routes.forEach((route: string, index: number): void => {
    const auditsToRun = getModulesToRun(audits, index, context);

    if (Object.keys(auditsToRun).length) {
      addSpinners(auditsToRun, route);

      const url = isRouteLocal(route) ? `http://localhost:${servePort}${route}` : route;

      queue.add(
        (): Promise<Report> =>
          doAudit(
            {
              chrome,
              url,
            },
            auditsToRun,
            context,
          ),
      );
    }
  });

  const report = (await queue.run()) as Report[];

  if (chrome) {
    await chrome.kill();
  }

  if (serve) {
    await serve.stop();
  }

  return report;
};

export default audit;
