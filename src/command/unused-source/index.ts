import Chrome from '@/module/chrome';
import Serve from '@/module/serve';
import UnusedSource from '@/module/unused-source';
import { UnusedRet } from '@/typings/module/unused-source';
import { CommandOptions } from '@/typings/utils/command';
import findPort from '@/utils/port';

const unusedSourceRunner = async (options: CommandOptions): Promise<UnusedRet | void> => {
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
      const unused = new UnusedSource();

      const ret = await unused.calculate(page, localUri);

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
