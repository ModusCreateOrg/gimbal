import OS from '@/utils/Process';

export interface CmdSpawnOptions {
  cwd?: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  env?: any; // cannot get ProcessEnv to work
  timeout?: number;
}

export interface CmdSpawnRet {
  code: number;
  end: Date;
  os: OS;
  start: Date;
  success: boolean;
}
