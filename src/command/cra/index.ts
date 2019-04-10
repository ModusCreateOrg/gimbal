// @ts-ignore
import lighthouse from 'lighthouse';
import bundlesizeModule from '@/module/bundlesize';
import LighthouseModule from '@/module/lighthouse';
import Chrome from '@/module/chrome';
import Heap from '@/module/chrome/Heap';
import UnusedCSS from '@/module/chrome/UnusedCSS';
import NpmInstall from '@/module/npm-install';
import Serve from '@/module/serve';
import { BundleConfig, ParsedBundleConfig } from '@/typings/module/bundlesize';
import { UnusedCSSRet } from '@/typings/module/chrome/UnusedCSS';
import { Snapshot } from '@/typings/module/chrome/Heap';
import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';
import { mkdirp, writeFile } from '@/utils/fs';
import findPort from '@/utils/port';

interface LighthouseCRAConfig {
  chromePort: string;
}

interface Rets {
  bundleSizes?: ParsedBundleConfig[];
  heapSnapshots?: Snapshot[];
  lighthouse?: lighthouse.Result | void;
  npmInstall?: CmdSpawnRet;
  unusedCSS?: UnusedCSSRet;
}

const defaultBundleConfig: BundleConfig = {
  configs: [
    {
      path: './build/precache-*.js',
      maxSize: '50 kB',
    },
    {
      path: './build/static/js/*.chunk.js',
      maxSize: '300 kB',
    },
    {
      path: './build/static/js/runtime*.js',
      maxSize: '30 kB',
    },
  ],
};

const calculateUnusedCss = async (chrome: Chrome, url: string): Promise<UnusedCSSRet | void> => {
  const page = await chrome.newPage();

  if (page) {
    const unused = new UnusedCSS();

    const ret = await unused.calculate(page, url);

    await page.close();

    return ret;
  }

  throw new Error('Could not open page to calculate unused css');
};

const takeHeapSnapshot = async (chrome: Chrome, url: string): Promise<Snapshot[] | void> => {
  const page = await chrome.newPage();

  if (page) {
    const heap = new Heap();

    await heap.capture(page, url);

    await page.close();

    return heap.serialize();
  }

  throw new Error('Could not open page to calculate unused css');
};

const runLighthouse = async (
  options: CommandOptions,
  config: LighthouseCRAConfig,
  url: string,
): Promise<lighthouse.Result> => {
  const artifactDir = `${options.cwd}/artifacts`;

  await mkdirp(artifactDir);

  // TODO make configurable
  const ret = await LighthouseModule(
    url,
    {
      chromePort: config.chromePort,
    },
    {
      extends: 'lighthouse:default',
      settings: {
        skipAudits: ['uses-http2', 'redirects-http', 'uses-long-cache-ttl'],
      },
    },
  );

  await writeFile(`${artifactDir}/lighthouse.json`, JSON.stringify(ret, null, 2));

  return ret;
};

const cra = async (options: CommandOptions): Promise<void> => {
  const rets: Rets = {};
  // if we are going to calculate unused CSS, take heap shotshot(s) or run lighthouse audits
  // we need to host the app and use chrome
  const needChromeAndServe = options.calculateUnusedCss || options.heapSnapshot || options.lighthouse;

  if (options.npmInstall) {
    let npmInstallCommand: string | string[] = (options.npmInstallCommand as string) || [];

    if (typeof npmInstallCommand === 'string') {
      npmInstallCommand = npmInstallCommand.split(' ');
    }

    rets.npmInstall = await NpmInstall(options, npmInstallCommand);
  }

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

  if (options.bundleSize) {
    // TODO make configurable
    rets.bundleSizes = await bundlesizeModule(options.cwd as string, defaultBundleConfig);
  }

  if (options.lighthouse && chrome && localUri) {
    rets.lighthouse = await runLighthouse(
      options,
      {
        chromePort: chrome.port as string,
      },
      localUri,
    );
  }

  if (options.calculateUnusedCss && chrome && localUri) {
    const ret = await calculateUnusedCss(chrome, localUri);

    if (ret) {
      rets.unusedCSS = ret;
    }
  }

  if (options.heapSnapshot && chrome && localUri) {
    const ret = await takeHeapSnapshot(chrome, localUri);

    if (ret) {
      rets.heapSnapshots = ret;
    }
  }

  if (chrome) {
    await chrome.kill();
  }

  if (serve) {
    await serve.stop();
  }

  // do something with the rets
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(rets, null, 2));
};

export default cra;
