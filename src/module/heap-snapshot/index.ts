import { Metrics, Page } from 'puppeteer';
import Config from '@/config';
import { CommandReturn } from '@/typings/command';
import { Config as HeapSnapshotConfig } from '@/typings/module/heap-snapshot';
import checkThresholds from '@/utils/threshold';
import defaultConfig from './default-config';

const heapSnapshot = async (
  page: Page,
  url: string,
  config: HeapSnapshotConfig = Config.get('configs.heap-snapshot', defaultConfig),
): Promise<CommandReturn> => {
  await page.goto(url);

  const data: Metrics = await page.metrics();

  return {
    data,
    success: checkThresholds(data, config.threshold),
  };
};

export default heapSnapshot;
