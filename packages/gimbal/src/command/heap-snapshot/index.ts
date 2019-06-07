import findPort from '@modus/gimbal-core/lib/utils/port';
import Chrome from '@/module/chrome';
import Serve from '@/module/serve';
import HeapSnapshot from '@/module/heap-snapshot';
import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

interface Options {
  chrome: Chrome;
  port: number;
}

const doAudit = async (options: Options, commandOptions: CommandOptions): Promise<Report> => {
  const { chrome, port } = options;
  const localUri = `http://localhost:${port}${commandOptions.route}`;
  const page = await chrome.newPage();

  if (!page) {
    return {
      data: [],
      success: true,
    };
  }

  const report = await HeapSnapshot(page, localUri, commandOptions);

  await page.close();

  return report;
};

const doAudits = (routes: string[], options: Options, commandOptions: CommandOptions): Promise<Report | Report[]> =>
  Promise.all(routes.map((route: string): Promise<Report> => doAudit(options, { ...commandOptions, route })));

const unusedSourceRunner = async (commandOptions: CommandOptions): Promise<Report | Report[]> => {
  const chrome = new Chrome();
  const servePort = await findPort();
  const serve = new Serve({
    port: servePort,
    public: commandOptions.cwd as string,
  });

  await serve.start();
  await chrome.launch();

  try {
    const options: Options = { chrome, port: servePort };
    const report = Array.isArray(commandOptions.route)
      ? await doAudits(commandOptions.route, options, commandOptions)
      : await doAudit(options, commandOptions);

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
