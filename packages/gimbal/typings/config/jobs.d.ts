import { CommandOptions } from '@/typings/utils/command';
import { CmdSpawnRet } from '@/typings/utils/spawn';

export interface Options {
  [key: string]: string;
}

export interface OptionsCt {
  options: Options;
}

export type ArrayJob = [string, OptionsCt];
export type Job = string | ArrayJob;
export type JobRet = CmdSpawnRet | void;

export interface JobStartEvent {
  args: string[];
  commandOptions: CommandOptions;
}

export interface JobEndSuccessEvent {
  args: string[];
  commandOptions: CommandOptions;
  ret: CmdSpawnRet;
}

export interface JobEndFailureEvent {
  args: string[];
  commandOptions: CommandOptions;
  error: Error;
}

export type JobEndEvent = JobEndSuccessEvent | JobEndFailureEvent;

export interface JobsStartEvent {
  commandOptions: CommandOptions;
  jobs: Job[];
}

export interface JobsEndEvent {
  commandOptions: CommandOptions;
  jobs: Job[];
  ret: JobRet[];
}
