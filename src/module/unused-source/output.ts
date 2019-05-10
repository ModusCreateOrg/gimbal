import { Report, ReportItem } from '@/typings/command';
import { Entry } from '@/typings/module/unused-source';
import { CommandOptions } from '@/typings/utils/command';
import { truncatePath } from '@/utils/string';

const type = 'unused-source';

const parseReport = (raw: Entry[], options: CommandOptions): Report => {
  const { checkThresholds } = options;
  const success: boolean = checkThresholds ? raw.every((entry: Entry): boolean => entry.success) : true;
  const data: ReportItem[] = raw.map(
    (entry: Entry): ReportItem => ({
      label: truncatePath(entry.url),
      rawLabel: entry.url,
      rawThreshold: entry.threshold,
      rawValue: entry.unusedPercentage,
      success: entry.success,
      threshold: entry.threshold,
      thresholdLimit: 'lower',
      value: entry.unusedPercentage,
      type,
    }),
  );

  return {
    data: [
      {
        data,
        label: 'Unused Source Checks',
        rawLabel: 'Unused Source Checks',
        success,
        type,
      },
    ],
    raw,
    success,
  };
};

export default parseReport;
