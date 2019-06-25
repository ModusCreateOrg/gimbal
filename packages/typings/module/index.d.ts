import { ReportThresholdLimit } from '@/typings/command';

export type Modules = 'heap-snapshot' | 'lighthouse' | 'size' | 'unused-source';

export type Types = 'number' | 'percentage' | 'size';

interface TypesMap {
  [label: string]: Types;
}

/* eslint-disable-next-line import/prefer-default-export */
export interface Meta {
  thresholdLimit: ReportThresholdLimit;
  thresholdType?: Types;
  thresholdTypes?: TypesMap;
}
