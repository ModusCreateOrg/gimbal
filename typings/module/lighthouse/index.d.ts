import { Report } from '@/typings/command';
import { Threshold } from '@/typings/utils/threshold';

export interface AuditRef {
  group?: string;
  id: string;
  weight: number;
}

export interface Category {
  auditRefs: AuditRef[];
  description?: string;
  id: string;
  manualDescription?: string;
  score: number;
  title: string;
}

export interface Categories {
  [name: string]: Category;
}

export interface ConfigSettings {
  skipAudits?: string[];
}

export interface Config {
  extends?: string;
  settings?: ConfigSettings;
  threshold: Threshold;
}

export interface Options {
  chromePort: string;
}

export interface Result {
  audits: {};
  categories: Categories;
  categoryGroups: {};
  configSettings: {};
  environment: {};
  fetchTime: string;
  finalUrl: string;
  i18n: {};
  lighthouseVersion: string;
  requestedUrl: string;
  runWarnings: string[];
  timing: {};
  userAgent: string;
}

export interface AuditStartEvent {
  config: Config;
  options: Options;
  url: string;
}

export interface AuditEndEvent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  audit: any; // lighthouse doesn't have types yet
  config: Config;
  options: Options;
  url: string;
}

export interface ReportStartEvent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  audit: any; // lighthouse doesn't have types yet
  config: Config;
  options: Options;
  url: string;
}

export interface ReportEndEvent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  audit: any; // lighthouse doesn't have types yet
  config: Config;
  options: Options;
  report: Report;
  url: string;
}
