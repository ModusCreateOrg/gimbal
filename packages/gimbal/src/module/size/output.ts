import checkThreshold from '@modus/gimbal-core/lib/utils/threshold';
import bytes from 'bytes';
import { relative } from 'path';
import { Report, ReportItem } from '@/typings/command';
import { Context } from '@/typings/context';
import { FileResult } from '@/typings/module/size';

const bytesConfig = { unitSeparator: ' ' };
const type = 'size';

interface ParseOptions {
  cwd: string;
  success: boolean;
}

const parseReport = (raw: FileResult[], context: Context): Report => {
  const checkThresholds = context.config.get('configs.checkThresholds');
  const cwd = context.config.get('configs.cwd');
  let success = true;

  const data = raw.map(
    (result: FileResult): ReportItem => {
      const resultSuccess = checkThresholds ? checkThreshold(result.sizeBytes, result.maxSizeBytes) : true;

      if (success) {
        success = resultSuccess;
      }

      return {
        label: relative(cwd, result.filePath),
        rawLabel: result.filePath,
        rawThreshold: result.maxSizeBytes,
        rawValue: result.size,
        success: resultSuccess,
        threshold: result.maxSize,
        thresholdLimit: 'upper',
        value: bytes(result.sizeBytes, bytesConfig),
        type,
      };
    },
  );

  return {
    data: [
      {
        data,
        label: 'Size Checks',
        rawLabel: 'Size Checks',
        success,
        type,
      },
    ],
    raw,
    success,
  };
};

export default parseReport;
