import { StdioOptions } from 'child_process';

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
  // TODO type os
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  os?: any;
  start: Date;
  success: boolean;
}
