import Chrome from '@/module/chrome';
import Lighthouse from '@/module/lighthouse';
import Serve from '@/module/serve';
import { CommandReturn } from '@/typings/command';
import { Result } from '@/typings/module/lighthouse';
import { CommandOptions } from '@/typings/utils/command';
import { mkdirp } from '@/utils/fs';
import findPort from '@/utils/port';

const lighthouseRunner = async (options: CommandOptions): Promise<CommandReturn> => {
  if (options.artifactDir) {
    await mkdirp(options.artifactDir as string);
  }

  const chrome = new Chrome();
  const servePort = await findPort();
  const serve = new Serve({
    port: servePort,
    public: options.cwd as string,
  });

  await serve.start();
  await chrome.launch();

  try {
    const data: Result = await Lighthouse(`http://localhost:${servePort}`, {
      chromePort: chrome.port as string,
    });

    await chrome.kill();
    await serve.stop();

    return {
      data,
      success: data.success,
    };
  } catch (error) {
    // need to catch a lighthouse error in order to stop the http server and chrome
    await chrome.kill();
    await serve.stop();

    return {
      error,
      success: false,
    };
  }
};

export default lighthouseRunner;
