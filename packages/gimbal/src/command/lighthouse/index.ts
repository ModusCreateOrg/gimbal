import { mkdirp } from '@modus/gimbal-core/lib/utils/fs';
import findPort from '@modus/gimbal-core/lib/utils/port';
import Queue from '@modus/gimbal-core/lib/utils/Queue';
import Chrome from '@/module/chrome';
import Lighthouse from '@/module/lighthouse';
import Serve from '@/module/serve';
import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { Options } from '@/typings/module/lighthouse';

const doAudit = (port: number, userOptions: Options, commandOptions: CommandOptions): Promise<Report | Report[]> => {
  if (Array.isArray(commandOptions.route)) {
    const queue = new Queue();

    commandOptions.route.forEach((route: string): void => {
      queue.add((): Promise<Report> => Lighthouse(`http://localhost:${port}${route}`, userOptions, commandOptions));
    });

    return queue.run();
  }

  return Lighthouse(`http://localhost:${port}${commandOptions.route}`, userOptions, commandOptions);
};

const lighthouseRunner = async (commandOptions: CommandOptions): Promise<Report | Report[]> => {
  if (commandOptions.artifactDir) {
    await mkdirp(commandOptions.artifactDir as string);
  }

  const chrome = new Chrome();
  const servePort = await findPort();
  const serve = new Serve({
    port: servePort,
    public: commandOptions.cwd,
  });

  await serve.start();
  await chrome.launch();

  try {
    const userOptions: Options = {
      chromePort: chrome.port as string,
    };

    const report = await doAudit(servePort, userOptions, commandOptions);

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
