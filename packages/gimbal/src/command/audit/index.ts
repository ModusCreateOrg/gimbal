import { resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import Queue from '@modus/gimbal-core/lib/utils/Queue';
import findPort from '@modus/gimbal-core/lib/utils/port';
import Config from '@/config';
import Chrome from '@/module/chrome';
import { get } from '@/module/registry';
import Serve from '@/module/serve';
import { Report, ReportItem } from '@/typings/command';
import { Modules } from '@/typings/module';
import { CommandOptions } from '@/typings/utils/command';

// register built-in modules
import '@/module/heap-snapshot/register';
import '@/module/lighthouse/register';
import '@/module/size/register';
import '@/module/unused-source/register';

interface AuditOptions {
  chrome?: Chrome;
  url?: string;
}

const shouldRunModule = (audits: string[], module: string): boolean => audits.indexOf(module) !== -1;

const doAudit = async (options: AuditOptions, audits: Modules[], commandOptions: CommandOptions): Promise<Report> => {
  const rets: ReportItem[] = [];
  let success = true;

  await Promise.all(
    audits.map(
      async (audit: string): Promise<void> => {
        const mod = get(audit);

        if (!mod) {
          throw new Error(`"${mod}" was not found in the module registry`);
        }

        const report = await mod({
          commandOptions,
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
      },
    ),
  );

  return {
    data: rets,
    success,
  };
};

const audit = async (options: CommandOptions): Promise<Report | Report[]> => {
  let audits: Modules[] = Config.get('audits');

  if (!audits || !audits.length) {
    /**
     * This block is more for backwards compatibility. If the `gimbal audit`
     * command was executed and there isn't the `audits` config, we can fall
     * back on the old way using the cli options that opts out.
     */
    audits = audits ? [...audits] : [];

    if (options.calculateUnusedSource) {
      audits.push('unused-source');
    }

    if (options.heapSnapshot) {
      audits.push('heap-snapshot');
    }

    if (options.lighthouse) {
      audits.push('lighthouse');
    }

    if (options.size) {
      audits.push('size');
    }
  }

  // if we are going to calculate unused CSS, take heap snapshot(s) or run lighthouse audits
  // we need to host the app and use chrome
  const needChromeAndServe =
    shouldRunModule(audits, 'heap-snapshot') ||
    shouldRunModule(audits, 'lighthouse') ||
    shouldRunModule(audits, 'unused-source');

  const servePort = needChromeAndServe ? await findPort() : null;
  const buildDir = resolvePath(options.cwd, options.buildDir as string);
  const serve = servePort ? new Serve({ port: servePort, public: buildDir }) : null;
  const chrome = needChromeAndServe ? new Chrome() : undefined;

  let report: Report | Report[];

  if (serve) {
    await serve.start();
  }

  if (chrome) {
    await chrome.launch();
  }

  if (Array.isArray(options.route)) {
    const queue = new Queue();

    options.route.forEach((route: string, index: number): void => {
      queue.add(
        (): Promise<Report> =>
          doAudit(
            {
              chrome,
              url: servePort ? `http://localhost:${servePort}${route}` : undefined,
            },
            audits,
            {
              ...options,
              route,
              // if we will run size module, we should only do it once since
              // it won't change across multiple runs
              size: options.size && index === 0,
            },
          ),
      );
    });

    report = (await queue.run()) as Report[];
  } else {
    report = await doAudit(
      {
        chrome,
        url: servePort ? `http://localhost:${servePort}${options.route}` : undefined,
      },
      audits,
      options,
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
