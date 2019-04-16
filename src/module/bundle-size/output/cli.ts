import bytes from 'bytes';
import figlet from 'figlet';
import Table, { HorizontalTable } from 'cli-table3';
import { ParsedBundleConfig, ParsedFile } from '@/typings/module/bundle-size';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';
import log from '@/utils/logger';
import { pad } from '@/utils/string';

const bytesConfig = { unitSeparator: ' ' };

const formatFile = (file: ParsedFile, maxSizeBytes: number): string => {
  const diff = file.size - maxSizeBytes;
  const diffBytes = bytes(Math.abs(diff), bytesConfig);
  const percentage = Math.abs((diff / maxSizeBytes) * 100);
  const prefix = diff > 0 ? '+' : '-';
  const difference = `${prefix}${diffBytes} (${prefix}${percentage.toFixed(2)} %)`;

  return `${file.path}
     Size: ${bytes(file.size, bytesConfig)}  │  Difference: ${difference}`;
};

const formatConfig = (config: ParsedBundleConfig, failures: boolean): string => {
  const files = failures ? config.failures : config.successes;
  const label = failures ? `failure${files.length === 1 ? '' : 's'}` : `success${files.length === 1 ? '' : 'es'}`;

  return `"${config.path}" has ${files.length} ${label}:
   Max Size: ${bytes(config.maxSizeBytes, bytesConfig)}
   ${files.map((file: ParsedFile): string => formatFile(file, config.maxSizeBytes)).join('\n')}`;
};

const outputVerbose = (failures: ParsedBundleConfig[], successes: ParsedBundleConfig[]): string[] => {
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

  return messages;
};

const outputTable = (
  failures: ParsedBundleConfig[],
  successes: ParsedBundleConfig[],
  options?: CliOutputOptions,
): HorizontalTable => {
  const table = options && options.table ? options.table : (new Table({ head: ['File', 'Size'] }) as HorizontalTable);

  table.push([{ colSpan: 2, content: 'FAILURES' }]);

  if (failures.length) {
    failures.forEach(
      (failureConfig: ParsedBundleConfig): void => {
        failureConfig.failures.forEach(
          (failure: ParsedFile): void => {
            table.push([failure.path, { content: bytes(failure.size, bytesConfig), hAlign: 'right' }]);
          },
        );
      },
    );
  } else {
    table.push([{ colSpan: 2, content: '  none' }]);
  }

  table.push([{ colSpan: 2, content: 'SUCCESSES' }]);

  if (successes.length) {
    successes.forEach(
      (successConfig: ParsedBundleConfig): void => {
        successConfig.successes.forEach(
          (success: ParsedFile): void => {
            table.push([success.path, { content: bytes(success.size, bytesConfig), hAlign: 'right' }]);
          },
        );
      },
    );
  } else {
    table.push([{ colSpan: 2, content: '  none' }]);
  }

  return table;
};

const cliOutput = (reports: ParsedBundleConfig[], commandOptions: CommandOptions, options?: CliOutputOptions): void => {
  if (reports.length) {
    const failures: ParsedBundleConfig[] = [];
    const successes: ParsedBundleConfig[] = [];
    const { verbose } = commandOptions;

    reports.forEach(
      (report: ParsedBundleConfig): void => {
        if (report.failures.length > 0) {
          failures.push(report);
        } else {
          successes.push(report);
        }
      },
    );

    if (verbose) {
      const messages = outputVerbose(failures, successes);

      log(messages.join('\n'));
    }

    const table = outputTable(failures, successes, options);

    if (!options || !options.table) {
      // if a table wasn't passed in, output table
      // otherwise let whatever passed the table in
      // manage outputting the table
      log(table.toString());
    }
  }
};

export default cliOutput;
