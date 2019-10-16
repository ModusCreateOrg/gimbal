import { Context } from '../context/index';

export type ReportThresholdLimit = 'lower' | 'upper';

export interface ReportError {
  message: string;
  stack: string[];
}

export interface ReportItem {
  data?: ReportItem[];
  label: string;
  lastValue?: number | string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  raw?: any;
  rawLabel: string;
  rawLastValue?: number | string;
  rawThreshold?: number | string;
  rawValue?: number | string;
  threshold?: number | string;
  thresholdLimit?: ReportThresholdLimit;
  value?: number | string;
  success: boolean;
  type: string;
}

export interface Report {
  error?: ReportError;
  data?: ReportItem[];
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  raw?: any;
  rawReports?: Report[];
  success: boolean;
}

export interface StartEvent {
  command: string;
  context: Context;
}

export interface EndEvent extends StartEvent {
  report: Report;
}

export interface ActionStartEvent {
  command: string;
  context: Context;
}

export interface ActionEndEvent extends ActionStartEvent {
  report: Report;
}
