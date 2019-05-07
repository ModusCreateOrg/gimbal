import { Report, ReportItem } from '@/typings/command';
import { Config as HeapSnapshotConfig, HeapMetrics } from '@/typings/module/heap-snapshot';
import { CommandOptions } from '@/typings/utils/command';

const keysToCareAbout = [
  'Documents',
  'Frames',
  'JSHeapTotalSize',
  'JSHeapUsedSize',
  'LayoutCount',
  'Nodes',
  'RecalcStyleCount',
];

const parseReport = (raw: HeapMetrics, { threshold }: HeapSnapshotConfig, options: CommandOptions): Report => {
  const { checkThresholds } = options;
  let success = true;

  const data: ReportItem[] = keysToCareAbout.map(
    (label: string): ReportItem => {
      const objThreshold = threshold[label];
      const value = raw[label] as number;
      const objSuccess = !checkThresholds || objThreshold == null || value <= objThreshold;

      if (!objSuccess) {
        success = false;
      }

      return {
        label,
        rawLabel: label,
        rawThreshold: objThreshold || '',
        rawValue: value,
        threshold: objThreshold || '',
        thresholdLimit: 'lower',
        success: objSuccess,
        value,
      };
    },
  );

  return {
    data: [
      {
        data,
        label: 'Heap Snapshot Checks',
        rawLabel: 'Heap Snapshot Checks',
        success,
      },
    ],
    raw,
    success,
  };
};

export default parseReport;
