import { mkdirp, resolvePath, writeFile } from '@modus/gimbal-core/lib/utils/fs';
import checkThreshold from '@modus/gimbal-core/lib/utils/threshold';
import { dirname } from 'path';
import { Report, ReportItem } from '@/typings/command';
import { Context } from '@/typings/context';
import { Audit, Config } from '@/typings/module/lighthouse';
import { AdvancedThreshold } from '@/typings/utils/threshold';

const type = 'lighthouse';

const parseReport = async (raw: Audit, { outputHtml, threshold }: Config, context: Context): Promise<Report> => {
  const { lhr, report } = raw;
  const checkThresholds = context.config.get('configs.checkThresholds');
  const isComplexThreshold = typeof threshold === 'object';
  let success = true;

  const data: ReportItem[] = Object.keys(lhr.categories).map(
    (label: string): ReportItem => {
      const obj = lhr.categories[label];
      const value = obj.score * 100;
      const thresholdNumber: number = (isComplexThreshold
        ? (threshold as AdvancedThreshold)[label]
        : threshold) as number;
      const objSuccess = !checkThresholds || checkThreshold(value, thresholdNumber, 'lower');

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

  if (outputHtml && report) {
    const [, html] = report;
    const cwd = context.config.get('configs.cwd');
    const path = resolvePath(cwd, outputHtml);

    await mkdirp(dirname(path));

    await writeFile(path, html, 'utf8');
  }

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
