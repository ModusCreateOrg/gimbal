import { Report } from '@/typings/command';
import { Context } from '@/typings/context';

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
  context: Context;
}

export interface AuditEndEvent extends AuditStartEvent {
  audit: FileResult[];
}

export interface ReportStartEvent extends AuditEndEvent {
  audit: FileResult[];
}

export interface ReportEndEvent extends ReportStartEvent {
  report: Report;
}
