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
  threshold: string;
}

export interface CheckStartEvent {
  config: SizeConfigs;
  fullPath: string;
  options: CommandOptions;
  maxSizeBytes: number;
  paths: string[];
  sizeConfig: SizeConfig;
}

export interface CheckEndEvent {
  config: SizeConfigs;
  failures: ParsedFile[];
  fullPath: string;
  options: CommandOptions;
  maxSizeBytes: number;
  paths: string[];
  sizeConfig: SizeConfig;
  successes: ParsedFile[];
}

export interface ItemCheckEvent {
  config: SizeConfigs;
  fail: boolean;
  options: CommandOptions;
  maxSizeBytes: number;
  parsedFile: ParsedFile;
  path: string;
  sizeConfig: SizeConfig;
  size: number;
}

export interface AuditStartEvent {
  config: SizeConfig;
  options: CommandOptions;
}

export interface AuditEndEvent {
  audit: ParsedSizeConfig[];
  config: SizeConfig;
  options: CommandOptions;
}

export interface ReportStartEvent {
  audit: ParsedSizeConfig[];
  config: SizeConfig;
  options: CommandOptions;
}

export interface ReportEndEvent {
  audit: ParsedSizeConfig[];
  config: SizeConfig;
  options: CommandOptions;
  report: Report;
}
