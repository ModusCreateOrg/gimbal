import { Metrics, Page } from 'puppeteer';
import Config from '@/config';
import { Report } from '@/typings/command';
import { Config as HeapSnapshotConfig, HeapMetrics } from '@/typings/module/heap-snapshot';
import defaultConfig from './default-config';
import parseReport from './output';

const heapSnapshot = async (
  page: Page,
  url: string,
  config: HeapSnapshotConfig = Config.get('configs.heap-snapshot', defaultConfig),
): Promise<Report> => {
  await page.goto(url);

  const data: Metrics = await page.metrics();

  return parseReport(data as HeapMetrics, config);
  // return {
  //   data,
  //   thresholdConfig: config.threshold,
  //   success: checkThresholds(data, config.threshold),
  // };
};

export default heapSnapshot;
