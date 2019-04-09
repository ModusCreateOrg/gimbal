// @ts-ignore
import lighthouse from 'lighthouse';
import Lighthouse from '@/module/lighthouse';
import Serve from '@/module/serve';
import { CommandOptions } from '@/typings/utils/command';
import { mkdirp, writeFile } from '@/utils/fs';
import findPort from '@/utils/port';

const lighthouseRunner = async (options: CommandOptions): Promise<lighthouse.Result | void> => {
  let ret;

  if (options.artifactDir) {
    await mkdirp(options.artifactDir as string);
  }

  const serve = new Serve({
    port: await findPort(),
    public: options.cwd as string,
  });

  try {
    // TODO make configurable
    ret = await Lighthouse(
      `http://localhost:${serve.port}`,
      {},
      {
        extends: 'lighthouse:default',
        settings: {
          skipAudits: ['uses-http2', 'redirects-http', 'uses-long-cache-ttl'],
        },
      },
    );

    await writeFile(`${options.artifactDir}/lighthouse.json`, JSON.stringify(ret, null, 2));
  } catch (e) {
    // need to catch a lighthouse error in order to stop the http server
  }

  await serve.stop();

  return ret;
};

export default lighthouseRunner;
