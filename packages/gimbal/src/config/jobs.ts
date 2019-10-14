import spawn from '@modus/gimbal-core/lib/utils/spawn';
import { splitOnWhitespace } from '@modus/gimbal-core/lib/utils/string';
import { ParsedArgs } from 'minimist';
import EventEmitter from '@/event';
import Logger from '@/logger';
import { ArrayJob, Job, JobRet, JobStartEvent, JobEndEvent, JobsStartEvent, JobsEndEvent } from '@/typings/config/jobs';
import { CmdSpawnRet } from '@/typings/utils/spawn';
import { CHILD_GIMBAL_PROCESS } from '@/utils/constants';

const prependDashes = (option: string): string => `--${option.replace(/^-+/, '')}`;

const processStringForm = async (job: string, args: ParsedArgs): Promise<JobRet> => {
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

  const jobArgs = [node, ...runtimeArgs, script, ...rest];

  const jobStartEvent: JobStartEvent = {
    args,
    jobArgs,
  };

  await EventEmitter.fire('config/job/start', jobStartEvent);

  try {
    const ret = await spawn(
      jobArgs,
      {
        cwd: args.cwd,
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
      jobArgs,
      ret,
    };

    await EventEmitter.fire('config/job/end', jobEndEvent);

    return ret;
  } catch (error) {
    const jobEndEvent: JobEndEvent = {
      args,
      jobArgs,
      error,
    };

    await EventEmitter.fire('config/job/end', jobEndEvent);

    // pass the failure up but let the rejection happen upstream
    return error;
  }
};

const processArrayForm = (job: ArrayJob, args: ParsedArgs): Promise<JobRet> => {
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

      return processStringForm(commandString, args);
    }
  }

  return Promise.resolve(undefined);
};

const handleResults = (ret: JobRet[]): JobRet[] => {
  let hasFailure = false;

  Logger.log(
    ret
      .map((item: void | CmdSpawnRet): string => {
        if (item) {
          if (!item.success) {
            hasFailure = true;
          }

          return item.logs.map((logItem: Buffer): string => logItem.toString()).join('');
        }

        return '';
      })
      .join('\n'),
  );

  if (hasFailure) {
    throw ret;
  }

  return ret;
};

const processJobs = async (jobs: Job[], args: ParsedArgs): Promise<JobRet[]> => {
  const startEvent: JobsStartEvent = {
    args,
    jobs,
  };

  await EventEmitter.fire('config/jobs/start', startEvent);

  const ret: JobRet[] = await Promise.all(
    jobs.map(
      async (job: Job): Promise<CmdSpawnRet | void> =>
        Array.isArray(job) ? processArrayForm(job, args) : processStringForm(job, args),
    ),
  ).then(handleResults);

  const endEvent: JobsEndEvent = {
    args,
    jobs,
    ret,
  };

  await EventEmitter.fire('config/jobs/end', endEvent);

  return ret;
};

export default processJobs;
