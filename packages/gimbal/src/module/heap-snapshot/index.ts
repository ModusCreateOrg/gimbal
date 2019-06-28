import { Metrics, Page } from 'puppeteer';
import Config from '@modus/gimbal-core/lib/config';
import EventEmitter from '@modus/gimbal-core/lib/event';
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
import { CommandOptions } from '@/typings/utils/command';
import defaultConfig from './default-config';
import parseReport from './output';

const heapSnapshot = async (
  page: Page,
  url: string,
  options: CommandOptions,
  config: HeapSnapshotConfig = Config.get('configs.heap-snapshot', defaultConfig),
): Promise<Report> => {
  const navigationStartEvent: NavigationStartEvent = {
    config,
    page,
    options,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/navigation/start`, navigationStartEvent);

  await page.goto(url);

  const navigationEndEvent: NavigationEndEvent = {
    config,
    page,
    options,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/navigation/end`, navigationEndEvent);

  const auditStartEvent: AuditStartEvent = {
    config,
    page,
    options,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/audit/start`, auditStartEvent);

  const audit: Metrics = await page.metrics();

  const auditEndEvent: AuditEndEvent = {
    audit,
    config,
    page,
    options,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/audit/end`, auditEndEvent);

  const reportStartEvent: ReportStartEvent = {
    audit,
    config,
    page,
    options,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/report/start`, reportStartEvent);

  const report = parseReport(audit as HeapMetrics, config, options);

  const reportEndEvent: ReportEndEvent = {
    audit,
    config,
    page,
    options,
    report,
    url,
  };

  await EventEmitter.fire(`module/heap-snapsnot/report/end`, reportEndEvent);

  return report;
};

export default heapSnapshot;
