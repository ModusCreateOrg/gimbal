import { CommandReturn } from '@/typings/command';
import { AdvancedThreshold } from '@/typings/utils/threshold';

/* eslint-disable-next-line import/prefer-default-export */
export interface Config {
  threshold?: AdvancedThreshold;
}

export interface HeapSnapshotReturn extends CommandReturn {
  thresholdConfig?: AdvancedThreshold;
}
