export interface SpinniesConfig {
  color?: string;
  disableSpins?: boolean;
  failColor?: string;
  failPrefix?: string;
  spinnerColor?: string;
  succeedColor?: string;
  succeedPrefix?: string;
  spinner?: {
    frames: string[];
    interval: number;
  };
}

export interface SpinniesOptions {
  color?: string;
  failColor?: string;
  status?: 'fail' | 'non-spinnable' | 'spinning' | 'stopped' | 'succeed';
  succeedColor?: string;
  text: string;
}

export interface SpinniesFailure {
  failColor?: string;
  text: string;
}

export interface SpinniesSuccess {
  succeedColor?: string;
  text: string;
}

export type SpinniesFinish = SpinniesFailure | SpinniesSuccess;

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
interface DeepArray<T> extends Array<T | DeepArray<T>> {}
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type LoggerArgs = DeepArray<any>;

export type LoggerFunction = (...val: LoggerArgs) => void;
export type LoggerGroupFunction = (...groups: LoggerArgs) => void;
export interface LoggerGroup {
  [name: string]: LoggerGroupFunction;
}

export interface Logger {
  error: LoggerFunction;
  group: LoggerGroup;
  log: LoggerFunction;
  verbose: LoggerFunction;
  [name: string]: LoggerFunction | LoggerGroup;
}
