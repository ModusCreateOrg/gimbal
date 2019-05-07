import { Metrics, Page } from 'puppeteer';
import Config from '@/config';
import { Report } from '@/typings/command';
import { Config as HeapSnapshotConfig, HeapMetrics } from '@/typings/module/heap-snapshot';
import { CommandOptions } from '@/typings/utils/command';
import defaultConfig from './default-config';
import parseReport from './output';

const heapSnapshot = async (
  page: Page,
  url: string,
  options: CommandOptions,
  config: HeapSnapshotConfig = Config.get('configs.heap-snapshot', defaultConfig),
): Promise<Report> => {
  await page.goto(url);

  const data: Metrics = await page.metrics();

  return parseReport(data as HeapMetrics, config, options);
};

export default heapSnapshot;
