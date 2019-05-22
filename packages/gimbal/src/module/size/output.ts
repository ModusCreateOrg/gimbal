import bytes from 'bytes';
import { relative } from 'path';
import checkThreshold from '@/shared/utils/threshold';
import { Report, ReportItem } from '@/typings/command';
import { FileResult } from '@/typings/module/size';
import { CommandOptions } from '@/typings/utils/command';

const bytesConfig = { unitSeparator: ' ' };
const type = 'size';

interface ParseOptions {
  cwd: string;
  success: boolean;
}

const parseReport = (raw: FileResult[], options: CommandOptions): Report => {
  const { checkThresholds, cwd } = options;
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
