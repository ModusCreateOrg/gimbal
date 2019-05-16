import { ReportThresholdLimit } from '@/typings/command';

type Types = 'number' | 'percentage' | 'size';

interface TypesMap {
  [label: string]: Types;
}

/* eslint-disable-next-line import/prefer-default-export */
export interface Meta {
  thresholdLimit: ReportThresholdLimit;
  thresholdType?: Types;
  thresholdTypes?: TypesMap;
}
