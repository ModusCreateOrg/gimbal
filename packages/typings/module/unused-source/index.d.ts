import { ParsedArgs } from 'minimist';
// eslint-disable-next-line
import { CoverageEntry, Page } from 'puppeteer';
import { Report } from '@/typings/command';
import { SizeConfigs } from '@/typings/module/size';

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
  args: ParsedArgs;
  config: UnusedSourceConfig;
  page: Page;
  url: string;
}

export interface NavigateEndEvent extends NavigateStartEvent {
  url: string;
}

export interface AuditStartEvent {
  args: ParsedArgs;
  config: UnusedSourceConfig;
  page: Page;
  url: string;
}

export interface AuditEndEvent extends AuditStartEvent {
  css: CoverageEntry[];
  js: CoverageEntry[];
}

export interface AuditParseStartEvent {
  args: ParsedArgs;
  config: UnusedSourceConfig;
  css: CoverageEntry[];
  js: CoverageEntry[];
  page: Page;
  url: string;
}

export interface AuditParseEndEvent extends AuditParseStartEvent {
  pageTotal: Entry;
  parsedCss: Entry[];
  parsedJs: Entry[];
}

export interface ReportStartEvent {
  args: ParsedArgs;
  audit: Entry[];
  config: UnusedSourceConfig;
  url: string;
}

export interface ReportEndEvent extends ReportStartEvent {
  report: Report;
}
