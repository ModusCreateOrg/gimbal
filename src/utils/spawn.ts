import { spawn } from 'child_process';
import { CmdSpawnOptions, CmdSpawnRet } from '@/typings/utils/spawn';
import log from '@/utils/logger';
import OS from './Process';

const cmdSpawn = (args: string[], options?: CmdSpawnOptions): Promise<CmdSpawnRet> => {
  return new Promise<CmdSpawnRet>(
    (resolve, reject): void => {
      const start = new Date();

      const cwd = options && options.cwd ? options.cwd : process.cwd();
      const env = options && options.env ? options.env : process.env;
      const timeout = options && options.timeout ? options.timeout : 5 * 1000 * 60; // 5 minutes

      const spawned = spawn(args[0], args.slice(1), { cwd, env, timeout });

      const os = new OS(spawned.pid);

      const onLog = (data: Buffer): void => {
        os.capture();

        log(data.toString());
      };

      spawned.stderr.on('data', onLog);
      spawned.stdout.on('data', onLog);

      spawned.on(
        'close',
        (code: number): void => {
          os.end();

          const end = new Date();

          const ret: CmdSpawnRet = {
            code,
            end,
            os,
            start,
            success: code === 0,
          };

          if (code) {
            reject(ret);
          } else {
            resolve(ret);
          }
        },
      );
    },
  );
};

export default cmdSpawn;
