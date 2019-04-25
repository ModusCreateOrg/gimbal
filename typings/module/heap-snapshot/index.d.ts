import { Metrics } from 'puppeteer';
import { CommandReturn } from '@/typings/command';
import { AdvancedThreshold } from '@/typings/utils/threshold';

export interface Config {
  threshold: AdvancedThreshold;
}

export interface HeapMetrics extends Metrics {
  [label: string]: number;
}

export interface HeapSnapshotReturn extends CommandReturn {
  thresholdConfig?: AdvancedThreshold;
}
