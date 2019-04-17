export interface SizeConfigs {
  maxSize: string;
  path: string;
}

export interface SizeConfig {
  compression?: 'brotli' | 'gzip';
  configs: SizeConfigs[];
}

export interface ParsedSizeConfig {
  failures: ParsedFile[];
  fullPath: string;
  maxSize: string;
  maxSizeBytes: number;
  path: string;
  successes: ParsedFile[];
}

export interface ParsedFile {
  fail: boolean;
  path: string;
  size: number;
}
