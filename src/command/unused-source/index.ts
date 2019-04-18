import Chrome from '@/module/chrome';
import Serve from '@/module/serve';
import UnusedSource from '@/module/unused-source';
import { CommandReturn } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import findPort from '@/utils/port';

const unusedSourceRunner = async (options: CommandOptions): Promise<CommandReturn> => {
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
        success: false,
      };
    }

    const data = await UnusedSource(page, localUri);

    await chrome.kill();
    await serve.stop();

    return {
      data,
      success: data.success,
    };
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
