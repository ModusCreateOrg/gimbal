import sizeModule from '@/module/size';
import LighthouseModule from '@/module/lighthouse';
import Chrome from '@/module/chrome';
import HeapSnapshot from '@/module/heap-snapshot';
import UnusedSource from '@/module/unused-source';
import Serve from '@/module/serve';
import { CommandReturn } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import findPort from '@/utils/port';

interface Rets {
  heapSnapshots?: CommandReturn;
  lighthouse?: CommandReturn;
  sizes?: CommandReturn;
  unusedSource?: CommandReturn;
}

const calculateUnusedSource = async (chrome: Chrome, url: string): Promise<CommandReturn | void> => {
  const page = await chrome.newPage();

  if (page) {
    const data = await UnusedSource(page, url);

    await page.close();

    return {
      data,
      success: data.success,
    };
  }

  throw new Error('Could not open page to calculate unused source');
};

const takeHeapSnapshot = async (chrome: Chrome, url: string): Promise<CommandReturn | void> => {
  const page = await chrome.newPage();

  if (page) {
    return HeapSnapshot(page, url);
  }

  throw new Error('Could not open page to get heap snapshot');
};

// success is if the object doesn't exist or if success property is true
const isSuccess = (obj?: CommandReturn): boolean => obj == null || obj.success;

const cra = async (options: CommandOptions): Promise<CommandReturn> => {
  const rets: Rets = {};
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

    rets.sizes = report;
  }

  if (options.lighthouse && chrome && localUri) {
    const data = await LighthouseModule(localUri, {
      chromePort: chrome.port as string,
    });

    rets.lighthouse = {
      data,
      success: data.success,
    };
  }

  if (options.calculateUnusedSource && chrome && localUri) {
    const report = await calculateUnusedSource(chrome, localUri);

    if (report) {
      rets.unusedSource = report;
    }
  }

  if (options.heapSnapshot && chrome && localUri) {
    const report = await takeHeapSnapshot(chrome, localUri);

    if (report) {
      rets.heapSnapshots = report;
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
    success:
      isSuccess(rets.sizes) &&
      isSuccess(rets.lighthouse) &&
      isSuccess(rets.unusedSource) &&
      isSuccess(rets.heapSnapshots),
  };
};

export default cra;
