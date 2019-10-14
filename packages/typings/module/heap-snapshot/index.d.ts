import { ParsedArgs } from 'minimist';
import { Metrics, Page } from 'puppeteer';
import { Report } from '@/typings/command';
import { AdvancedThreshold } from '@/typings/utils/threshold';

export interface Config {
  threshold: AdvancedThreshold;
}

export interface HeapMetrics extends Metrics {
  [label: string]: number;
}

export interface NavigationStartEvent {
  args: ParsedArgs;
  config: Config;
  page: Page;
  url: string;
}

export interface NavigationEndEvent extends NavigationStartEvent {
  url: string;
}

export interface AuditStartEvent {
  args: ParsedArgs;
  config: Config;
  page: Page;
  url: string;
}

export interface AuditEndEvent extends AuditStartEvent {
  audit: Metrics;
}

export interface ReportStartEvent {
  args: ParsedArgs;
  audit: Metrics;
  config: Config;
  page: Page;
  url: string;
}

export interface ReportEndEvent extends ReportStartEvent {
  report: Report;
}
