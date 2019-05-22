import { ReportItem, Report } from '@/typings/command';
import { PluginConfig } from '@/typings/config/plugin';

export type InspectCallback = () => void | Promise<void>;
export type ItemFailReasons = string | false;

export interface Config {
  failOnBreach: boolean;
  saveOnlyOnSuccess: boolean;
  storage?: PluginConfig;
  thresholds: {
    diffPercentage: number;
    number: number;
    percentage: number;
    size: number;
  };
}

export type LastReportItem = {
  command: string;
  lastValue: number | string;
  lastValueChange?: number;
  lastValueDiff?: number;
  rawLastValue: number | string;
  report: string | Report;
} & ReportItem;

export interface GetEvent {
  command: string;
}

export interface SaveEvent {
  command: string;
  report: Report;
}
