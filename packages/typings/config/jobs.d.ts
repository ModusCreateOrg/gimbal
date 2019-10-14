import { ParsedArgs } from 'minimist';
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
  args: ParsedArgs;
  jobArgs: string[];
}

export interface JobEndSuccessEvent {
  args: ParsedArgs;
  jobArgs: string[];
  ret: CmdSpawnRet;
}

export interface JobEndFailureEvent {
  args: ParsedArgs;
  jobArgs: string[];
  error: Error;
}

export type JobEndEvent = JobEndSuccessEvent | JobEndFailureEvent;

export interface JobsStartEvent {
  args: ParsedArgs;
  jobs: Job[];
}

export interface JobsEndEvent extends JobsStartEvent {
  ret: JobRet[];
}
