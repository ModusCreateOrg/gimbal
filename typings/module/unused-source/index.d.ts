import { SizeConfigs } from '@/typings/module/size';

export interface CoverageRange {
  end: number;
  start: number;
}

export interface Entry {
  success: boolean;
  threshold?: string;
  total: number;
  url: string;
  unused: number;
  unusedPercentage: string;
  used: number;
  [name: string]: number | string | boolean | void;
}

export interface UnusedRet {
  entries: Entry[];
  success: boolean;
  threshold?: string;
  total: number;
  unused: number;
  unusedPercentage: number;
  used: number;
  url: string;
}

export interface UnusedSourceConfig {
  threshold: string | SizeConfigs[];
}
