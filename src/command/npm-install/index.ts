import NpmInstall from '@/module/npm-install';
import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';

const npmInstall = (options: CommandOptions, args?: string[]): Promise<CmdSpawnRet> => NpmInstall(options, args);

export default npmInstall;
