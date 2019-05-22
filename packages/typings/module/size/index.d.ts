import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

export interface SizeConfigs {
  maxSize: string;
  path: string;
  type?: string;
}

export interface SizeConfig {
  compression?: 'brotli' | 'gzip';
  threshold: SizeConfigs[];
}

export interface FileResult {
  filePath: string;
  isDirectory: boolean;
  maxSizeBytes: number;
  maxSize: string;
  sizeBytes: number;
  size: string;
  thresholdPath: string;
}

export interface AuditStartEvent {
  config: SizeConfig;
  options: CommandOptions;
}

export interface AuditEndEvent {
  audit: FileResult[];
  config: SizeConfig;
  options: CommandOptions;
}

export interface ReportStartEvent {
  audit: FileResult[];
  config: SizeConfig;
  options: CommandOptions;
}

export interface ReportEndEvent {
  audit: FileResult[];
  config: SizeConfig;
  options: CommandOptions;
  report: Report;
}
