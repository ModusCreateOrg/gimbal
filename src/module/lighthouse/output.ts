import { Report, ReportItem } from '@/typings/command';
import { Config, Result } from '@/typings/module/lighthouse';
import { CommandOptions } from '@/typings/utils/command';
import { AdvancedThreshold } from '@/typings/utils/threshold';

const type = 'lighthouse';

const parseReport = (raw: Result, { threshold }: Config, options: CommandOptions): Report => {
  const { checkThresholds } = options;
  const isComplexThreshold = typeof threshold === 'object';
  let success = true;

  const data: ReportItem[] = Object.keys(raw.categories).map(
    (label: string): ReportItem => {
      const obj = raw.categories[label];
      const value = obj.score * 100;
      const thresholdNumber: number = (isComplexThreshold
        ? (threshold as AdvancedThreshold)[label]
        : threshold) as number;
      const objSuccess = checkThresholds ? value >= thresholdNumber : true;

      if (!objSuccess) {
        success = objSuccess;
      }

      return {
        label: obj.title,
        rawLabel: label,
        rawThreshold: thresholdNumber,
        rawValue: obj.score,
        threshold: thresholdNumber,
        thresholdLimit: 'lower',
        success: objSuccess,
        value: value.toFixed(0),
        type,
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
        type,
      },
    ],
    raw,
    success,
  };
};

export default parseReport;
