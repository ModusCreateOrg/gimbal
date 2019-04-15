import spawn from '@/utils/spawn';
import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';

const npmInstall = (options: CommandOptions, args: string[]): Promise<CmdSpawnRet> => {
  if (!args.length) {
    args.push('npm', 'install');
  }

  return spawn(args, { cwd: options.cwd });
};

export default npmInstall;
