import { Report, ReportItem } from '@/typings/command';
import { Config, Result } from '@/typings/module/lighthouse';
import { AdvancedThreshold } from '@/typings/utils/threshold';

const parseReport = (raw: Result, { threshold }: Config): Report => {
  const isComplexThreshold = typeof threshold === 'object';
  let success = true;

  const data: ReportItem[] = Object.keys(raw.categories).map(
    (label: string): ReportItem => {
      const obj = raw.categories[label];
      const value = obj.score * 100;
      const thresholdNumber: number = (isComplexThreshold
        ? (threshold as AdvancedThreshold)[label]
        : threshold) as number;
      const objSuccess = value >= thresholdNumber;

      if (!objSuccess) {
        success = objSuccess;
      }

      return {
        label,
        rawLabel: label,
        rawThreshold: thresholdNumber,
        rawValue: obj.score,
        threshold: thresholdNumber,
        thresholdLimit: 'lower',
        success: objSuccess,
        value: value.toFixed(0),
      };
    },
  );

  return {
    data: [
      {
        data,
        label: 'Lighthouse Audits',
        rawLabel: 'Lighthouse Audits',
        success,
      },
    ],
    raw,
    success,
  };
};

export default parseReport;
