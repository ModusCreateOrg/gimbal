import { ParsedArgs } from 'minimist';
import { addSpinner, finishSpinner, startSpinner } from '@modus/gimbal-core/lib/logger';
import { exists, resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import findPort from '@modus/gimbal-core/lib/utils/port';
import Queue from '@modus/gimbal-core/lib/utils/Queue';
import Config from '@/config';
import Chrome from '@/module/chrome';
import registry from '@/module/registry';
import Serve from '@/module/serve';
import { Report, ReportItem } from '@/typings/command';
import { Modules } from '@/typings/module';

// register built-in modules
import '@/module/heap-snapshot/register';
import '@/module/lighthouse/register';
import '@/module/size/register';
import '@/module/unused-source/register';

interface AuditOptions {
  chrome: Chrome;
  url: string;
}

const didAuditPass = (report?: Report): boolean => !report || report.success;

const doAudit = async (options: AuditOptions, audits: Modules[], args: ParsedArgs): Promise<Report> => {
  const rets: ReportItem[] = [];
  let success = true;

  await Promise.all(
    audits.map(
      async (audit: string): Promise<void> => {
        const mod = registry.get(audit);

        if (!mod) {
          finishSpinner(audit, false, `"${mod}" was not found in the module registry`);

          throw new Error(`"${mod}" was not found in the module registry`);
        }

        startSpinner(audit);

        const report = await mod({
          args,
          ...options,
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

const findBuildDir = async (args: ParsedArgs, dirArr = buildDirs): Promise<string | void> => {
  const arr = dirArr.slice();

  if (arr.length !== 0) {
    const dir = arr.shift();
    const fullPath = resolvePath(args.cwd, dir as string);

    if (await exists(fullPath)) {
      return fullPath;
    }
  }

  return findBuildDir(args, arr);
};

const audit = async (args: ParsedArgs): Promise<Report | Report[]> => {
  let audits: Modules[] = Config.get('audits');

  if (!audits || !audits.length) {
    /**
     * This block is more for backwards compatibility. If the `gimbal audit`
     * command was executed and there isn't the `audits` config, we can fall
     * back on the old way using the cli options that opts out.
     */
    audits = audits ? [...audits] : [];

    if (args.calculateUnusedSource) {
      audits.push('unused-source');
    }

    if (args.heapSnapshot) {
      audits.push('heap-snapshot');
    }

    if (args.lighthouse) {
      audits.push('lighthouse');
    }

    if (args.size) {
      audits.push('size');
    }
  }

  const servePort = await findPort();
  const buildDir = await findBuildDir(args);

  if (!buildDir) {
    throw Error('Could not find a build directory');
  }

  /* eslint-disable-next-line no-param-reassign */
  args.buildDir = buildDir;

  const serve = new Serve({ port: servePort, public: buildDir });
  const chrome = new Chrome();

  let report: Report | Report[];

  if (serve) {
    await serve.start();
  }

  if (chrome) {
    await chrome.launch();
  }

  if (args.route.length > 1) {
    const queue = new Queue();

    args.route.forEach((route: string, index: number): void => {
      const filteredAudits = audits.filter((name: string): boolean => {
        const meta = registry.getMeta(name);

        if (meta && meta.maxNumRoutes && index >= meta.maxNumRoutes) {
          return false;
        }

        return true;
      });

      if (filteredAudits.length) {
        filteredAudits.forEach((name: string): void =>
          addSpinner(name, { status: 'stopped', text: `[ ${name} ] - ${route}` }),
        );

        queue.add(
          (): Promise<Report> =>
            doAudit(
              {
                chrome,
                url: `http://localhost:${servePort}${route}`,
              },
              filteredAudits,
              {
                ...args,
                route,
              },
            ),
        );
      }
    });

    report = (await queue.run()) as Report[];
  } else {
    audits.forEach((name: string): void => addSpinner(name, `[ ${name} ]`));

    report = await doAudit(
      {
        chrome,
        url: `http://localhost:${servePort}${args.route[0]}`,
      },
      audits,
      args,
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
