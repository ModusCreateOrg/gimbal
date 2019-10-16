import checkThreshold from '@modus/gimbal-core/lib/utils/threshold';
import { Report, ReportItem } from '@/typings/command';
import { Context } from '@/typings/context';
import { Config as HeapSnapshotConfig, HeapMetrics } from '@/typings/module/heap-snapshot';

const keysToCareAbout = [
  'Documents',
  'Frames',
  'JSHeapTotalSize',
  'JSHeapUsedSize',
  'LayoutCount',
  'Nodes',
  'RecalcStyleCount',
];

const type = 'heap-snapshot';

const parseReport = (raw: HeapMetrics, { threshold }: HeapSnapshotConfig, context: Context): Report => {
  const checkThresholds = context.config.get('configs.checkThresholds');
  let success = true;

  const data: ReportItem[] = keysToCareAbout.map(
    (label: string): ReportItem => {
      const objThreshold = threshold[label];
      const value = raw[label];
      const objSuccess = !checkThresholds || objThreshold == null || checkThreshold(value, objThreshold);

      if (!objSuccess) {
        success = false;
      }

      return {
        label,
        rawLabel: label,
        rawThreshold: objThreshold,
        rawValue: value,
        threshold: objThreshold,
        thresholdLimit: 'lower',
        success: objSuccess,
        value,
        type,
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
        type,
      },
    ],
    raw,
    success,
  };
};

export default parseReport;
