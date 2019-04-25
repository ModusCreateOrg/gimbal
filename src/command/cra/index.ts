import sizeModule from '@/module/size';
import LighthouseModule from '@/module/lighthouse';
import Chrome from '@/module/chrome';
import HeapSnapshot from '@/module/heap-snapshot';
import UnusedSource from '@/module/unused-source';
import Serve from '@/module/serve';
import { Report, ReportItem } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import findPort from '@/utils/port';

const calculateUnusedSource = async (chrome: Chrome, url: string): Promise<Report | void> => {
  const page = await chrome.newPage();

  if (page) {
    const report = await UnusedSource(page, url);

    await page.close();

    return report;
  }

  throw new Error('Could not open page to calculate unused source');
};

const takeHeapSnapshot = async (chrome: Chrome, url: string): Promise<Report | void> => {
  const page = await chrome.newPage();

  if (page) {
    return HeapSnapshot(page, url);
  }

  throw new Error('Could not open page to get heap snapshot');
};

const cra = async (options: CommandOptions): Promise<Report> => {
  const rets: ReportItem[] = [];
  let success = true;
  // if we are going to calculate unused CSS, take heap snapshot(s) or run lighthouse audits
  // we need to host the app and use chrome
  const needChromeAndServe = options.calculateUnusedCss || options.heapSnapshot || options.lighthouse;

  const servePort = needChromeAndServe ? await findPort() : null;
  const localUri = servePort ? `http://localhost:${servePort}` : null;
  const serve = servePort ? new Serve({ port: servePort, public: `${options.cwd}/build` }) : null;
  const chrome = needChromeAndServe ? new Chrome() : null;

  if (serve) {
    await serve.start();
  }

  if (chrome) {
    await chrome.launch();
  }

  if (options.size) {
    const report = await sizeModule(options.cwd);

    if (!report.success) {
      success = false;
    }

    rets.push({
      data: report.data,
      label: 'Size',
      rawLabel: 'Size',
      success: report.success,
    });
  }

  if (options.lighthouse && chrome && localUri) {
    const report = await LighthouseModule(localUri, {
      chromePort: chrome.port as string,
    });

    if (!report.success) {
      success = false;
    }

    rets.push({
      data: report.data,
      label: 'Heap Snapshot',
      rawLabel: 'Heap Snapshot',
      success: report.success,
    });
  }

  if (options.calculateUnusedSource && chrome && localUri) {
    const report = await calculateUnusedSource(chrome, localUri);

    if (report) {
      if (!report.success) {
        success = false;
      }

      rets.push({
        data: report.data,
        label: 'Unused Source',
        rawLabel: 'Unused Source',
        success: report.success,
      });
    }
  }

  if (options.heapSnapshot && chrome && localUri) {
    const report = await takeHeapSnapshot(chrome, localUri);

    if (report) {
      if (!report.success) {
        success = false;
      }

      rets.push({
        data: report.data,
        label: 'Heap Snapshot',
        rawLabel: 'Heap Snapshot',
        success: report.success,
      });
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

export default cra;
