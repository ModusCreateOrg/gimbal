import { Metrics, Page } from 'puppeteer';
import { Report } from '@/typings/command';
import { Context } from '@/typings/context';
import { AdvancedThreshold } from '@/typings/utils/threshold';

export interface Config {
  threshold: AdvancedThreshold;
}

export interface HeapMetrics extends Metrics {
  [label: string]: number;
}

export interface NavigationStartEvent {
  config: Config;
  context: Context;
  page: Page;
  url: string;
}

export interface NavigationEndEvent extends NavigationStartEvent {
  url: string;
}

export interface AuditStartEvent {
  config: Config;
  context: Context;
  page: Page;
  url: string;
}

export interface AuditEndEvent extends AuditStartEvent {
  audit: Metrics;
}

export interface ReportStartEvent {
  audit: Metrics;
  config: Config;
  context: Context;
  page: Page;
  url: string;
}

export interface ReportEndEvent extends ReportStartEvent {
  report: Report;
}
