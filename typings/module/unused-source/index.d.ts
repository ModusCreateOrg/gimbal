import { SizeConfigs } from '@/typings/module/size';

export interface CoverageRange {
  end: number;
  start: number;
}

export interface Entry {
  success: boolean;
  threshold?: UnusedSourceThresholdSimple;
  total: number;
  url: string;
  unused: number;
  unusedPercentage: number;
  used: number;
  [name: string]: number | string | boolean | void;
}

export interface UnusedRet {
  css: Entry[];
  js: Entry[];
  success: boolean;
  threshold?: UnusedSourceThresholdSimple;
  total: number;
  unused: number;
  unusedPercentage: number;
  used: number;
  url: string;
}

export type UnusedSourceThresholdSimple = number | string;
export type UnusedSourceThreshold = UnusedSourceThresholdSimple | SizeConfigs[];

export interface UnusedSourceConfig {
  threshold: UnusedSourceThreshold;
}
