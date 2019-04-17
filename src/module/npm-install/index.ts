import spawn from '@/utils/spawn';
import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';

const npmInstall = (options: CommandOptions, args?: string[]): Promise<CmdSpawnRet> => {
  const commandArgs = args || [];

  if (!commandArgs.length) {
    commandArgs.push('npm', 'install');
  }

  return spawn(commandArgs, { cwd: options.cwd });
};

export default npmInstall;
