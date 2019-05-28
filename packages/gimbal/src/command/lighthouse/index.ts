import Chrome from '@/module/chrome';
import Lighthouse from '@/module/lighthouse';
import Serve from '@/module/serve';
import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { mkdirp } from '@/shared/utils/fs';
import findPort from '@/shared/utils/port';

const lighthouseRunner = async (options: CommandOptions): Promise<Report> => {
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
    const report: Report = await Lighthouse(
      `http://localhost:${servePort}${options.route}`,
      {
        chromePort: chrome.port as string,
      },
      options,
    );

    await chrome.kill();
    await serve.stop();

    return report;
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
