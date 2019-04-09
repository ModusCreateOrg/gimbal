// @ts-ignore
import lighthouse from 'lighthouse';
import LighthouseModule from '@/module/lighthouse';
import NpmInstall from '@/module/npm-install';
import Serve from '@/module/serve';
import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';
import { mkdirp, writeFile } from '@/utils/fs';
import findPort from '@/utils/port';

interface LighthouseCRAConfig {
  port: number;
}

interface Rets {
  lighthouse?: lighthouse.Result | void;
  npmInstall?: CmdSpawnRet;
}

const runLighthouse = async (options: CommandOptions, config: LighthouseCRAConfig): Promise<lighthouse.Result> => {
  const artifactDir = `${options.cwd}/artifacts`;

  await mkdirp(artifactDir);

  // TODO make configurable
  const ret = await LighthouseModule(
    `http://localhost:${config.port}`,
    {},
    {
      extends: 'lighthouse:default',
      settings: {
        skipAudits: ['uses-http2', 'redirects-http', 'uses-long-cache-ttl'],
      },
    },
  );

  await writeFile(`${artifactDir}/lighthouse.json`, JSON.stringify(ret, null, 2));

  return ret;
};

const cra = async (options: CommandOptions): Promise<void> => {
  const rets: Rets = {};

  if (options.npmInstall) {
    let npmInstallCommand: string | string[] = (options.npmInstallCommand as string) || [];

    if (typeof npmInstallCommand === 'string') {
      npmInstallCommand = npmInstallCommand.split(' ');
    }

    rets.npmInstall = await NpmInstall(options, npmInstallCommand);
  }

  // may need to serve the app for more than just lighthouse
  const serve = options.lighthouse ? new Serve({ port: await findPort(), public: `${options.cwd}/build` }) : null;

  if (serve) {
    await serve.start();
  }

  if (options.lighthouse && serve) {
    rets.lighthouse = await runLighthouse(options, {
      port: serve.port as number,
    });
  }

  if (serve) {
    await serve.stop();
  }

  // do something with the rets
  // eslint-disable-next-line no-console
  console.log(rets);
};

export default cra;
