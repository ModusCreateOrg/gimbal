import { resolvePath } from '@/utils/fs';
import spawn from '@/utils/spawn';
import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';

const npmInstall = (options: CommandOptions, args: string[]): Promise<CmdSpawnRet> => {
  const cwd = resolvePath(options.cwd as string);

  if (!args.length) {
    args.push('npm', 'install');
  }

  return spawn(args, { cwd });
};

export default npmInstall;
