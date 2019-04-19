import { CommandOptions } from '@/typings/utils/command';
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

const prependDashes = (option: string): string => `--${option.replace(/^-+/, '')}`;

const processStringForm = async (job: string, commandOptions: CommandOptions): Promise<void> => {
  const rest = splitOnWhitespace(job);

  // should never happen but an empty string was passed
  if (!rest.length) {
    return;
  }

  const [node, script] = process.argv;
  const [command] = rest;

  // Check if this was executed with a path ending in "/gimbal".
  // If it was, then we are in compiled code as in dev, it's
  // the "src/index.ts" file. In dev, we need to register a couple
  // modules in order to support TypeScript.
  const runtimeArgs: string[] = script.match(/\/gimbal$/)
    ? []
    : ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register'];

  try {
    await spawn(
      [node, ...runtimeArgs, script, ...rest],
      {
        cwd: commandOptions.cwd,
        env: {
          ...process.env,
          [GLOBAL.CHILD_GIMBAL_PROCESS]: 'true',
        },
        stdio: 'inherit',
      },
      {
        noUsage: true,
      },
    );
  } catch {
    log(`Breaking issue discovered running ${command}`);
  }
};

const processArrayForm = (job: ArrayJob, commandOptions: CommandOptions): Promise<void> | void => {
  const splitCommand = splitOnWhitespace(job[0]);
  const [command] = splitCommand;

  if (command) {
    const [, { options }] = job;
    const optionsArr = Object.keys(options);

    if (optionsArr.length) {
      const commandString: string = optionsArr.reduce(
        (acc: string, key: string): string => `${acc} ${prependDashes(key)} ${options[key]}`,
        command,
      );

      return processStringForm(commandString, commandOptions);
    }
  }

  return undefined;
};

const processJobs = (jobs: Job[], commandOptions: CommandOptions): Promise<(void)[]> => {
  return Promise.all(
    jobs.map(
      async (job: Job): Promise<void> =>
        Array.isArray(job)
          ? processArrayForm(job as ArrayJob, commandOptions)
          : processStringForm(job as string, commandOptions),
    ),
  );
};

export default processJobs;
