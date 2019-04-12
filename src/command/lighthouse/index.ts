import Chrome from '@/module/chrome';
import Lighthouse from '@/module/lighthouse';
import Serve from '@/module/serve';
import { Result } from '@/typings/module/lighthouse';
import { CommandOptions } from '@/typings/utils/command';
import { mkdirp, writeFile } from '@/utils/fs';
import findPort from '@/utils/port';

const lighthouseRunner = async (options: CommandOptions): Promise<Result | void> => {
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
    // TODO make configurable
    const ret = await Lighthouse(
      `http://localhost:${servePort}`,
      {
        chromePort: chrome.port as string,
      },
      {
        extends: 'lighthouse:default',
        settings: {
          skipAudits: ['uses-http2', 'redirects-http', 'uses-long-cache-ttl'],
        },
      },
    );

    await writeFile(`${options.artifactDir}/lighthouse.json`, JSON.stringify(ret, null, 2));

    await chrome.kill();
    await serve.stop();

    return ret;
  } catch (e) {
    // need to catch a lighthouse error in order to stop the http server
    await chrome.kill();
    await serve.stop();

    throw e;
  }
};

export default lighthouseRunner;
