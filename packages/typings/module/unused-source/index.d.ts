// eslint-disable-next-line
import { CoverageEntry, Page } from 'puppeteer';
import { Report } from '@/typings/command';
import { SizeConfigs } from '@/typings/module/size';
import { CommandOptions } from '@/typings/utils/command';

export interface CoverageRange {
  end: number;
  start: number;
}

export interface Entry {
  rawEntry?: CoverageEntry;
  success: boolean;
  threshold?: string;
  total: number;
  url: string;
  unused: number;
  unusedPercentage: string;
  used: number;
  [name: string]: CoverageEntry | number | string | boolean | void;
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

export interface NavigateStartEvent {
  config: UnusedSourceConfig;
  options: CommandOptions;
  page: Page;
  url: string;
}

export interface NavigateEndEvent {
  config: UnusedSourceConfig;
  options: CommandOptions;
  page: Page;
  url: string;
}

export interface AuditStartEvent {
  config: UnusedSourceConfig;
  options: CommandOptions;
  page: Page;
  url: string;
}

export interface AuditEndEvent {
  config: UnusedSourceConfig;
  css: CoverageEntry[];
  js: CoverageEntry[];
  options: CommandOptions;
  page: Page;
  url: string;
}

export interface AuditParseStartEvent {
  config: UnusedSourceConfig;
  css: CoverageEntry[];
  js: CoverageEntry[];
  options: CommandOptions;
  page: Page;
  url: string;
}

export interface AuditParseEndEvent {
  config: UnusedSourceConfig;
  css: CoverageEntry[];
  js: CoverageEntry[];
  options: CommandOptions;
  pageTotal: Entry;
  page: Page;
  parsedCss: Entry[];
  parsedJs: Entry[];
  url: string;
}

export interface ReportStartEvent {
  audit: Entry[];
  config: UnusedSourceConfig;
  options: CommandOptions;
  url: string;
}

export interface ReportEndEvent {
  audit: Entry[];
  config: UnusedSourceConfig;
  options: CommandOptions;
  report: Report;
  url: string;
}
