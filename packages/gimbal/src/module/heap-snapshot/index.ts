import { ParsedArgs } from 'minimist';
import { Metrics, Page } from 'puppeteer';
import Config from '@/config';
import EventEmitter from '@/event';
import { Report } from '@/typings/command';
import {
  Config as HeapSnapshotConfig,
  HeapMetrics,
  AuditStartEvent,
  AuditEndEvent,
  NavigationStartEvent,
  NavigationEndEvent,
  ReportStartEvent,
  ReportEndEvent,
} from '@/typings/module/heap-snapshot';
import defaultConfig from './default-config';
import parseReport from './output';

const heapSnapshot = async (
  page: Page,
  url: string,
  args: ParsedArgs,
  config: HeapSnapshotConfig = Config.get('configs.heap-snapshot', defaultConfig),
): Promise<Report> => {
  const navigationStartEvent: NavigationStartEvent = {
    args,
    config,
    page,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/navigation/start`, navigationStartEvent);

  await page.goto(url);

  const navigationEndEvent: NavigationEndEvent = {
    args,
    config,
    page,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/navigation/end`, navigationEndEvent);

  const auditStartEvent: AuditStartEvent = {
    args,
    config,
    page,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/audit/start`, auditStartEvent);

  const audit: Metrics = await page.metrics();

  const auditEndEvent: AuditEndEvent = {
    args,
    audit,
    config,
    page,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/audit/end`, auditEndEvent);

  const reportStartEvent: ReportStartEvent = {
    args,
    audit,
    config,
    page,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/report/start`, reportStartEvent);

  const report = parseReport(audit as HeapMetrics, config, args);

  const reportEndEvent: ReportEndEvent = {
    args,
    audit,
    config,
    page,
    report,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/report/end`, reportEndEvent);

  return report;
};

export default heapSnapshot;
