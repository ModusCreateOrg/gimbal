import GLOBAL from '@/utils/constants';
import log from '@/utils/logger';
import spawn from '@/utils/spawn';

const processJobs = (jobs: string[]): Promise<void[]> => {
  const [node, script] = process.argv;
  const runtimeArgs: string[] = [];

  try {
    /* eslint-disable-next-line global-require, import/no-extraneous-dependencies */
    require('ts-node');

    runtimeArgs.push('-r', 'ts-node/register', '-r', 'tsconfig-paths/register');
  } catch {} // eslint-disable-line no-empty

  return Promise.all(
    jobs.map(
      async (job: string): Promise<void> => {
        const rest = job.split(' ');
        const [command] = rest;

        if (rest.length) {
          try {
            await spawn([node, ...runtimeArgs, script, ...rest], {
              env: {
                ...process.env,
                [GLOBAL.CHILD_GIMBAL_PROCESS]: 'true',
              },
            });
          } catch {
            log(`I seemed to have run into an issue with ${command}`);
          }
        }
      },
    ),
  );
};

export default processJobs;
