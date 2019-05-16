import { StdioOptions } from 'child_process';
import OS from '@/utils/Process';

export interface CmdSpawnOptions {
  cwd?: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  env?: any; // cannot get ProcessEnv to work
  stdio?: StdioOptions;
  timeout?: number;
}

export interface CmdSpawnRet {
  code: number;
  end: Date;
  logs: Buffer[];
  os?: OS;
  start: Date;
  success: boolean;
}
