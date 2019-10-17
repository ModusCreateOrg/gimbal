import { addSpinner, finishSpinner, startSpinner } from '@modus/gimbal-core/lib/logger';
import { exists, resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import findPort from '@modus/gimbal-core/lib/utils/port';
import Queue from '@modus/gimbal-core/lib/utils/Queue';
import { URL } from 'url';
import Context from '../../context';
import Chrome from '@/module/chrome';
import Serve from '@/module/serve';
import { Report, ReportItem } from '@/typings/command';
import { Modules } from '@/typings/module';

// register built-in modules
import '@/module/heap-snapshot/register';
import '@/module/lighthouse/register';
import '@/module/size/register';
import '@/module/unused-source/register';

interface AuditOptions {
  chrome?: Chrome;
  url: string;
}

const didAuditPass = (report?: Report): boolean => !report || report.success;

const doAudit = async (options: AuditOptions, audits: Modules[], context: Context): Promise<Report> => {
  const rets: ReportItem[] = [];
  let success = true;

  await Promise.all(
    audits.map(
      async (audit: string): Promise<void> => {
        const mod = context.module.get(audit);

        if (!mod) {
          finishSpinner(audit, false, `"${mod}" was not found in the module registry`);

          throw new Error(`"${mod}" was not found in the module registry`);
        }

        startSpinner(audit);

        const report = await mod({
          ...options,
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

        finishSpinner(audit, succeed);
      },
    ),
  );

  return {
    data: rets,
    success,
  };
};

const buildDirs = ['build', 'dist'];

const findBuildDir = async (context: Context, dirArr = buildDirs): Promise<string | void> => {
  const arr = dirArr.slice();

  if (arr.length !== 0) {
    const dir = arr.shift();
    const cwd = context.config.get('configs.cwd');
    const fullPath = resolvePath(cwd, dir as string);

    if (await exists(fullPath)) {
      return fullPath;
    }
  }

  return findBuildDir(context, arr);
};

const isModuleBrowserable = (context: Context): boolean => {
  const audits = context.config.get('audits');

  return audits.some((audit: string): boolean => {
    const meta = context.module.getMeta(audit);

    return meta != null && meta.capabilities.browser === true;
  });
};

// TODO bet we need a better way to know if a route is local
// if it throws an error, likely an invalid url and therefore
// just a route, not a URI
const isRouteLocal = (route: string): boolean => {
  try {
    /* eslint-disable-next-line no-new */
    new URL(route);

    return false;
  } catch (error) {
    return true;
  }
};

const isRoutesLocal = (context: Context): boolean => {
  const routes = context.config.get('configs.route');

  return routes.some(isRouteLocal);
};

const audit = async (context: Context): Promise<Report | Report[]> => {
  // don't pass default array as 2nd arg of config.get as it will merge
  const audits: Modules[] = context.config.get('audits') || ['heap-snapshot', 'lighthouse', 'size', 'unused-source'];

  if (context.config.get('configs.calculateUnusedSource') === false) {
    audits.splice(audits.indexOf('unused-source'), 1);
  }

  if (context.config.get('configs.heapSnapshot') === false) {
    audits.splice(audits.indexOf('heap-snapshot'), 1);
  }

  if (context.config.get('configs.lighthouse') === false) {
    audits.splice(audits.indexOf('lighthouse'), 1);
  }

  if (context.config.get('configs.size') === false) {
    audits.splice(audits.indexOf('size'), 1);
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

  if (modulesBrowserable) {
    if (hasLocalRoute) {
      // only need a build dir if we have a local route
      buildDir = await findBuildDir(context);

      if (!buildDir) {
        throw Error('Could not find a build directory. Make sure the application is built');
      }

      context.config.set('configs.buildDir', buildDir);

      // only need to start a local server if we have a local route
      servePort = await findPort();
      serve = new Serve({ port: servePort, public: buildDir });
    }

    chrome = new Chrome();
  }

  let report: Report | Report[];

  if (serve) {
    await serve.start();
  }

  if (chrome) {
    await chrome.launch();
  }

  const routes = context.config.get('configs.route');

  const filteredAudits = audits.filter((name: string): boolean => {
    const meta = context.module.getMeta(name);

    if (meta) {
      // if no local routes, do not run non-remote audits
      if (!hasLocalRoute && !meta.capabilities.remote) {
        return false;
      }
    }

    return true;
  });

  if (routes.length > 1) {
    const queue = new Queue();

    routes.forEach((route: string, index: number): void => {
      const auditsToRun = filteredAudits.filter((name: string): boolean => {
        const meta = context.module.getMeta(name);

        if (meta && meta.maxNumRoutes && index >= meta.maxNumRoutes) {
          return false;
        }

        return true;
      });

      if (auditsToRun.length) {
        auditsToRun.forEach((name: string): void =>
          addSpinner(name, { status: 'stopped', text: `[ ${name} ] - ${route}` }),
        );

        const url = isRouteLocal(route) ? `http://localhost:${servePort}${route}` : route;

        queue.add(
          (): Promise<Report> =>
            doAudit(
              {
                chrome,
                url,
              },
              filteredAudits,
              context,
            ),
        );
      }
    });

    report = (await queue.run()) as Report[];
  } else {
    filteredAudits.forEach((name: string): void => addSpinner(name, `[ ${name} ]`));

    const route = routes[0];
    const url = isRouteLocal(route) ? `http://localhost:${servePort}${route}` : route;

    report = await doAudit(
      {
        chrome,
        url,
      },
      filteredAudits,
      context,
    );
  }

  if (chrome) {
    await chrome.kill();
  }

  if (serve) {
    await serve.stop();
  }

  return report;
};

export default audit;
