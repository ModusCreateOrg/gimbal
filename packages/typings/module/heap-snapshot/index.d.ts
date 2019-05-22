import { Metrics, Page } from 'puppeteer';
import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { AdvancedThreshold } from '@/typings/utils/threshold';

export interface Config {
  threshold: AdvancedThreshold;
}

export interface HeapMetrics extends Metrics {
  [label: string]: number;
}

export interface NavigationStartEvent {
  config: Config;
  page: Page;
  options: CommandOptions;
  url: string;
}

export interface NavigationEndEvent {
  config: Config;
  page: Page;
  options: CommandOptions;
  url: string;
}

export interface AuditStartEvent {
  config: Config;
  page: Page;
  options: CommandOptions;
  url: string;
}

export interface AuditEndEvent {
  audit: Metrics;
  config: Config;
  page: Page;
  options: CommandOptions;
  url: string;
}

export interface ReportStartEvent {
  audit: Metrics;
  config: Config;
  page: Page;
  options: CommandOptions;
  url: string;
}

export interface ReportEndEvent {
  audit: Metrics;
  config: Config;
  page: Page;
  options: CommandOptions;
  report: Report;
  url: string;
}
