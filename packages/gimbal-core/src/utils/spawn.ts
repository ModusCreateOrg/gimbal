import { spawn } from 'child_process';
import { CmdSpawnOptions, CmdSpawnRet } from '@/typings/utils/spawn';
import OS from './Process';

interface CmdSpawnConfig {
  noUsage?: boolean;
}

const cmdSpawn = (args: string[], options?: CmdSpawnOptions, config: CmdSpawnConfig = {}): Promise<CmdSpawnRet> => {
  return new Promise<CmdSpawnRet>((resolve, reject): void => {
    const start = new Date();

    const spawned = spawn(args[0], args.slice(1), {
      cwd: process.cwd(),
      env: process.env,
      timeout: 5 * 1000 * 60, // 5 minutes
      ...options,
    });
    const os = config.noUsage ? undefined : new OS(spawned.pid);
    const logs: Buffer[] = [];

    if (spawned.stderr && spawned.stdout) {
      const onLog = (data: Buffer): void => {
        if (os) {
          os.capture();
        }

        logs.push(data);
      };

      spawned.stderr.on('data', (data: Buffer): void => onLog(data));
      spawned.stdout.on('data', (data: Buffer): void => onLog(data));
    }

    spawned.on('close', (code: number): void => {
      if (os) {
        os.end();
      }

      const end = new Date();

      const ret: CmdSpawnRet = {
        code,
        end,
        logs,
        os,
        start,
        success: code === 0,
      };

      if (code) {
        reject(ret);
      } else {
        resolve(ret);
      }
    });
  });
};

export default cmdSpawn;
