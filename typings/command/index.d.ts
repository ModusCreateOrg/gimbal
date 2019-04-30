export type ReportThresholdLimit = 'lower' | 'upper';

export interface ReportError {
  message: string;
  stack: string[];
}

export interface ReportItem {
  data?: ReportItem[];
  label: string;
  rawLabel: string;
  rawThreshold?: number | string;
  rawValue?: number | string;
  threshold?: number | string;
  thresholdLimit?: ReportThresholdLimit;
  value?: number | string;
  success: boolean;
}

export interface Report {
  error?: ReportError;
  data?: ReportItem[];
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  raw?: any;
  success: boolean;
}
