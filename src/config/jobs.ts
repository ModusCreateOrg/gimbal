import GLOBAL from '@/utils/constants';
import log from '@/utils/logger';
import spawn from '@/utils/spawn';
import { splitOnWhitespace } from '@/utils/string';

interface Options {
  [key: string]: string;
}
interface OptionsCt {
  options: Options;
}
type ArrayJob = [string, OptionsCt];
type Job = string | ArrayJob;

const prependDashes = (option: string): string => `--${option.replace(/^-/, '')}`;

const processStringForm = async (job: string): Promise<void> => {
  const [node, script] = process.argv;
  const runtimeArgs: string[] = [];

  try {
    /* eslint-disable-next-line global-require, import/no-extraneous-dependencies */
    require('ts-node');

    runtimeArgs.push('-r', 'ts-node/register', '-r', 'tsconfig-paths/register');
  } catch {} // eslint-disable-line no-empty

  const rest = job.split(' ');

  if (!rest.length) {
    return;
  }

  const [command] = rest;

  try {
    await spawn([node, ...runtimeArgs, script, ...rest], {
      env: {
        ...process.env,
        [GLOBAL.CHILD_GIMBAL_PROCESS]: 'true',
      },
    });
  } catch {
    log(`Breaking issue discovered running ${command}`);
  }
};

const processArrayForm = (job: ArrayJob): void => {
  const splitCommand = splitOnWhitespace(job[0]);
  const [command] = splitCommand;
  let commandString = '';

  if (command) {
    const { options } = job[1];
    const optionsArr = Object.keys(options);

    if (optionsArr.length) {
      commandString = optionsArr.reduce(
        (acc: string, key: string): string => `${acc} ${prependDashes(key)} ${options[key]}`,
        command,
      );
      processStringForm(commandString);
    }
  }
};

const processJobs = (jobs: Job[]): Promise<void[]> => {
  return Promise.all(
    jobs.map(
      async (job: Job): Promise<void> => {
        const isArray = Array.isArray(job);

        if (isArray) {
          processArrayForm(job as ArrayJob);
        } else {
          processStringForm(job as string);
        }
      },
    ),
  );
};

export default processJobs;
