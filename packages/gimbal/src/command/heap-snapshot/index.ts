import Chrome from '@/module/chrome';
import Serve from '@/module/serve';
import HeapSnapshot from '@/module/heap-snapshot';
import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import findPort from '@/shared/utils/port';

const unusedSourceRunner = async (options: CommandOptions): Promise<Report> => {
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

    if (!page) {
      return {
        data: [],
        success: true,
      };
    }

    const report = await HeapSnapshot(page, localUri, options);

    await page.close();

    await chrome.kill();
    await serve.stop();

    return report;
  } catch (error) {
    // need to catch any error in order to stop the http server
    await chrome.kill();
    await serve.stop();

    return {
      error,
      success: false,
    };
  }
};

export default unusedSourceRunner;
