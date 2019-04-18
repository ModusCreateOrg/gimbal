export interface CoverageRange {
  end: number;
  start: number;
}

export interface Entry {
  success: boolean;
  total: number;
  url: string;
  unused: number;
  unusedPercentage: number;
  used: number;
}

export interface UnusedRet {
  css: Entry[];
  js: Entry[];
  success: boolean;
  total: number;
  unused: number;
  unusedPercentage: number;
  used: number;
  url: string;
}

export type UnusedSourceThreshold = number | string;

export interface UnusedSourceConfig {
  threshold: UnusedSourceThreshold;
}
