export interface BundleConfigs {
  maxSize: string;
  path: string;
}

export interface BundleConfig {
  compression?: 'brotli' | 'gzip';
  configs: BundleConfigs[];
}

export interface ParsedBundleConfig {
  files: ParsedFile[];
  fullPath: string;
  maxSize: string;
  maxSizeBytes: number;
  path: string;
}

export interface ParsedFile {
  fail: boolean;
  path: string;
  size: number;
  source: Buffer;
}
