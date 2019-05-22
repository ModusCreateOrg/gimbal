import sizeModule from '@/module/size';
import LighthouseModule from '@/module/lighthouse';
import Chrome from '@/module/chrome';
import HeapSnapshot from '@/module/heap-snapshot';
import UnusedSource from '@/module/unused-source';
import Serve from '@/module/serve';
import { Report, ReportItem } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { resolvePath } from '@/shared/utils/fs';
import findPort from '@/shared/utils/port';

const calculateUnusedSource = async (chrome: Chrome, url: string, options: CommandOptions): Promise<Report | void> => {
  const page = await chrome.newPage();

  if (page) {
    const report = await UnusedSource(page, url, options);

    await page.close();

    return report;
  }

  throw new Error('Could not open page to calculate unused source');
};

const takeHeapSnapshot = async (chrome: Chrome, url: string, options: CommandOptions): Promise<Report | void> => {
  const page = await chrome.newPage();

  if (page) {
    return HeapSnapshot(page, url, options);
  }

  throw new Error('Could not open page to get heap snapshot');
};

const audit = async (options: CommandOptions): Promise<Report> => {
  const rets: ReportItem[] = [];
  let success = true;
  // if we are going to calculate unused CSS, take heap snapshot(s) or run lighthouse audits
  // we need to host the app and use chrome
  const needChromeAndServe = options.calculateUnusedCss || options.heapSnapshot || options.lighthouse;

  const servePort = needChromeAndServe ? await findPort() : null;
  const localUri = servePort ? `http://localhost:${servePort}` : null;
  const buildDir = resolvePath(options.cwd, options.buildDir as string);
  const serve = servePort ? new Serve({ port: servePort, public: buildDir }) : null;
  const chrome = needChromeAndServe ? new Chrome() : null;

  if (serve) {
    await serve.start();
  }

  if (chrome) {
    await chrome.launch();
  }

  if (options.size) {
    const report = await sizeModule(options);

    if (!report.success) {
      success = false;
    }

    if (report.data) {
      rets.push(...report.data);
    }
  }

  if (options.lighthouse && chrome && localUri) {
    const report = await LighthouseModule(
      localUri,
      {
        chromePort: chrome.port as string,
      },
      options,
    );

    if (!report.success) {
      success = false;
    }

    if (report.data) {
      rets.push(...report.data);
    }
  }

  if (options.calculateUnusedSource && chrome && localUri) {
    const report = await calculateUnusedSource(chrome, localUri, options);

    if (report) {
      if (!report.success) {
        success = false;
      }

      if (report.data) {
        rets.push(...report.data);
      }
    }
  }

  if (options.heapSnapshot && chrome && localUri) {
    const report = await takeHeapSnapshot(chrome, localUri, options);

    if (report) {
      if (!report.success) {
        success = false;
      }

      if (report.data) {
        rets.push(...report.data);
      }
    }
  }

  if (chrome) {
    await chrome.kill();
  }

  if (serve) {
    await serve.stop();
  }

  return {
    data: rets,
    success,
  };
};

export default audit;
