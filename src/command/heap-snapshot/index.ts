import { Metrics } from 'puppeteer';
import Chrome from '@/module/chrome';
import Serve from '@/module/serve';
import HeapSnapshot from '@/module/heap-snapshot';
import { CommandOptions } from '@/typings/utils/command';
import findPort from '@/utils/port';

const unusedSourceRunner = async (options: CommandOptions): Promise<Metrics | void> => {
  const chrome = new Chrome();
  const servePort = await findPort();
  const localUri = `http://localhost:${servePort}`;
  const serve = new Serve({
    port: servePort,
    public: options.cwd as string,
  });

  await serve.start();
  await chrome.launch();

  try {
    const page = await chrome.newPage();

    if (page) {
      const ret = await HeapSnapshot(page, localUri);

      await page.close();

      await chrome.kill();
      await serve.stop();

      return ret;
    }
  } catch (e) {
    // need to catch any error in order to stop the http server
    await chrome.kill();
    await serve.stop();

    throw e;
  }

  return undefined;
};

export default unusedSourceRunner;
