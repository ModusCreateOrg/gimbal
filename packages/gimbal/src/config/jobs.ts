import Logger from '@/logger';
import EventEmitter from '@/shared/event';
import spawn from '@/shared/utils/spawn';
import { splitOnWhitespace } from '@/shared/utils/string';
import { ArrayJob, Job, JobRet, JobStartEvent, JobEndEvent, JobsStartEvent, JobsEndEvent } from '@/typings/config/jobs';
import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';
import { CHILD_GIMBAL_PROCESS } from '@/utils/constants';

const prependDashes = (option: string): string => `--${option.replace(/^-+/, '')}`;

const processStringForm = async (job: string, commandOptions: CommandOptions): Promise<JobRet> => {
  const rest = splitOnWhitespace(job);

  // should never happen but an empty string was passed
  if (!rest.length) {
    return undefined;
  }

  const [node, script] = process.argv;

  // Check if this was executed with a path ending in "/gimbal".
  // If it was, then we are in compiled code as in dev, it's
  // the "src/index.ts" file. In dev, we need to register a couple
  // modules in order to support TypeScript.
  const runtimeArgs: string[] = script.match(/\/gimbal$/)
    ? []
    : ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register'];

  const args = [node, ...runtimeArgs, script, ...rest];

  const jobStartEvent: JobStartEvent = {
    args,
    commandOptions,
  };

  await EventEmitter.fire('config/job/start', jobStartEvent);

  try {
    const ret = await spawn(
      args,
      {
        cwd: commandOptions.cwd,
        env: {
          ...process.env,
          [CHILD_GIMBAL_PROCESS]: 'true',
        },
        stdio: 'pipe',
      },
      {
        noUsage: true,
      },
    );

    const jobEndEvent: JobEndEvent = {
      args,
      commandOptions,
      ret,
    };

    await EventEmitter.fire('config/job/end', jobEndEvent);

    return ret;
  } catch (error) {
    const jobEndEvent: JobEndEvent = {
      args,
      commandOptions,
      error,
    };

    await EventEmitter.fire('config/job/end', jobEndEvent);

    // pass the failure up but let the rejection happen upstream
    return error;
  }
};

const processArrayForm = (job: ArrayJob, commandOptions: CommandOptions): Promise<JobRet> => {
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

  return Promise.resolve(undefined);
};

const handleResults = (ret: JobRet[]): JobRet[] => {
  let hasFailure = false;

  Logger.log(
    ret
      .map(
        (item: void | CmdSpawnRet): string => {
          if (item) {
            if (!item.success) {
              hasFailure = true;
            }

            return item.logs.map((logItem: Buffer): string => logItem.toString()).join('');
          }

          return '';
        },
      )
      .join('\n'),
  );

  if (hasFailure) {
    throw ret;
  }

  return ret;
};

const processJobs = async (jobs: Job[], commandOptions: CommandOptions): Promise<JobRet[]> => {
  const startEvent: JobsStartEvent = {
    commandOptions,
    jobs,
  };

  await EventEmitter.fire('config/jobs/start', startEvent);

  const ret: JobRet[] = await Promise.all(
    jobs.map(
      async (job: Job): Promise<CmdSpawnRet | void> =>
        Array.isArray(job)
          ? processArrayForm(job as ArrayJob, commandOptions)
          : processStringForm(job as string, commandOptions),
    ),
  ).then(handleResults);

  const endEvent: JobsEndEvent = {
    commandOptions,
    jobs,
    ret,
  };

  await EventEmitter.fire('config/jobs/end', endEvent);

  return ret;
};

export default processJobs;
