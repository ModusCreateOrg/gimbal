import Config from '@modus/gimbal-core/lib/config';
import { addSpinner, finishSpinner, startSpinner } from '@modus/gimbal-core/lib/logger';
import { get } from '@modus/gimbal-core/lib/module/registry';
import { resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import findPort from '@modus/gimbal-core/lib/utils/port';
import Queue from '@modus/gimbal-core/lib/utils/Queue';
import Chrome from '@/module/chrome';
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
  chrome: Chrome;
  url: string;
}

const didAuditPass = (report?: Report): boolean => !report || report.success;

const doAudit = async (options: AuditOptions, audits: Modules[], commandOptions: CommandOptions): Promise<Report> => {
  const rets: ReportItem[] = [];
  let success = true;

  await Promise.all(
    audits.map(
      async (audit: string): Promise<void> => {
        const mod = get(audit);

        if (!mod) {
          finishSpinner(audit, false, `"${mod}" was not found in the module registry`);

          throw new Error(`"${mod}" was not found in the module registry`);
        }

        startSpinner(audit);

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

  const servePort = await findPort();
  const buildDir = resolvePath(options.cwd, options.buildDir as string);
  const serve = new Serve({ port: servePort, public: buildDir });
  const chrome = new Chrome();

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
      audits.forEach((auditToRun: string): void =>
        addSpinner(auditToRun, { status: 'stopped', text: `[ ${auditToRun} ] - ${route}` }),
      );

      queue.add(
        (): Promise<Report> =>
          doAudit(
            {
              chrome,
              url: `http://localhost:${servePort}${route}`,
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
    audits.forEach((auditToRun: string): void => addSpinner(auditToRun, `[ ${auditToRun} ]`));

    report = await doAudit(
      {
        chrome,
        url: `http://localhost:${servePort}${options.route}`,
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
