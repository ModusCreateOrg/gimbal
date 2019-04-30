import { Metrics } from 'puppeteer';
import { AdvancedThreshold } from '@/typings/utils/threshold';

export interface Config {
  threshold: AdvancedThreshold;
}

export interface HeapMetrics extends Metrics {
  [label: string]: number;
}
