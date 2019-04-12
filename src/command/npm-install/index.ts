import NpmInstall from '@/module/npm-install';
import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';

const npmInstall = (options: CommandOptions, args: string[]): Promise<CmdSpawnRet> =>
  NpmInstall(options, args).then(
    (ret: CmdSpawnRet): CmdSpawnRet => {
      // log(JSON.stringify(ret.os.serialize(), null, 2));

      // do something with ret here like output it?
      return ret;
    },
  );

export default npmInstall;
