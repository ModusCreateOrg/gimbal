import bytes from 'bytes';
import figlet from 'figlet';
import { ParsedBundleConfig, ParsedFile } from '@/typings/module/bundlesize';
import log from '@/utils/logger';
import { pad } from '@/utils/string';

const formatFile = (file: ParsedFile, maxSizeBytes: number): string => {
  const diff = file.size - maxSizeBytes;
  const diffBytes = bytes(Math.abs(diff), { unitSeparator: ' ' });
  const percentage = Math.abs((diff / maxSizeBytes) * 100);
  const prefix = diff > 0 ? '+' : '-';
  const difference = `${prefix}${diffBytes} (${prefix}${percentage.toFixed(2)} %)`;

  return `${file.path}
     Size: ${bytes(file.size, { unitSeparator: ' ' })}  │  Difference: ${difference}`;
};

const formatConfig = (config: ParsedBundleConfig, failures: boolean): string => {
  const files = failures ? config.failures : config.successes;
  const label = failures ? `failure${files.length === 1 ? '' : 's'}` : `success${files.length === 1 ? '' : 'es'}`;

  return `"${config.path}" has ${files.length} ${label}:
   Max Size: ${bytes(config.maxSizeBytes, { unitSeparator: ' ' })}
   ${files.map((file: ParsedFile): string => formatFile(file, config.maxSizeBytes)).join('\n')}`;
};

const cliOutput = (reports: ParsedBundleConfig[]): void => {
  const failures: ParsedBundleConfig[] = [];
  const successes: ParsedBundleConfig[] = [];

  reports.forEach(
    (report: ParsedBundleConfig): void => {
      if (report.failures.length > 0) {
        failures.push(report);
      } else {
        successes.push(report);
      }
    },
  );

  if (reports.length) {
    const messages: string[] = [figlet.textSync('Bundle Size Check'), ` ${pad(80, '─')}`, ''];

    if (failures.length) {
      const message = failures
        .map((parsedConfig: ParsedBundleConfig): string => formatConfig(parsedConfig, true))
        .join('\n');

      messages.push('FAILURES:', message, '');
    }

    const message = successes
      .map((parsedConfig: ParsedBundleConfig): string => formatConfig(parsedConfig, false))
      .join('\n');

    messages.push('SUCCESSES:', message);

    log(messages.join('\n'));
  }
};

export default cliOutput;
