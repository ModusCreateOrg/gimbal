import bytes from 'bytes';
import figlet from 'figlet';
import log from '@/utils/logger';
import { pad } from '@/utils/string';
import { ParsedDirectoryConfig, DirectoryCheck } from '@/typings/module/directory-size';
import { CliOutputOptions } from '@/typings/output/cli';
import Table, { HorizontalTable } from 'cli-table3';
import { CommandOptions } from '@/typings/utils/command';

const bytesConfig = { unitSeparator: ' ' };

const formatDiff = (config: DirectoryCheck): string => {
  const maxSizeBytes = bytes(config.maxSize);
  const diff = config.size - maxSizeBytes;
  const diffBytes = bytes(Math.abs(diff), { unitSeparator: ' ' });
  const percentage = Math.abs((diff / maxSizeBytes) * 100);
  const prefix = diff > 0 ? '+' : '-';
  const difference = `${prefix}${diffBytes} (${prefix}${percentage.toFixed(2)} %)`;

  return `${config.path}
    Size: ${bytes(config.size, { unitSeparator: ' ' })}  │  Difference: ${difference}`;
};

const formatReport = (config: DirectoryCheck): string => {
  return `Max Size: ${config.maxSize}
    ${formatDiff(config)}`;
};

const outputVerbose = (failures: DirectoryCheck[], successes: DirectoryCheck[]): string[] => {
  const messages: string[] = [figlet.textSync('Directory Size Check'), ` ${pad(90, '─')}`, ''];

  if (failures.length) {
    const message = failures.map((directoryCheck: DirectoryCheck): string => formatReport(directoryCheck)).join('\n');

    messages.push('FAILURES:', message, '');
  }

  if (successes.length) {
    const message = successes.map((directoryCheck: DirectoryCheck): string => formatReport(directoryCheck)).join('\n');

    messages.push('SUCCESSES:', message, '');
  }

  return messages;
};

const outputTable = (
  failures: DirectoryCheck[],
  successes: DirectoryCheck[],
  options?: CliOutputOptions,
): HorizontalTable => {
  const table =
    options && options.table ? options.table : (new Table({ head: ['Directory', 'Size'] }) as HorizontalTable);

  table.push([{ colSpan: 2, content: 'FAILURES' }]);

  if (failures.length) {
    failures.forEach(
      (directoryCheck: DirectoryCheck): void => {
        table.push([directoryCheck.path, { content: bytes(directoryCheck.size, bytesConfig), hAlign: 'right' }]);
      },
    );
  } else {
    table.push([{ colSpan: 2, content: '  none' }]);
  }

  table.push([{ colSpan: 2, content: 'SUCCESSES' }]);

  if (successes.length) {
    successes.forEach(
      (directoryCheck: DirectoryCheck): void => {
        table.push([directoryCheck.path, { content: bytes(directoryCheck.size, bytesConfig), hAlign: 'right' }]);
      },
    );
  } else {
    table.push([{ colSpan: 2, content: '  none' }]);
  }

  return table;
};

const cliOutput = (report: ParsedDirectoryConfig, commandOptions: CommandOptions, options?: CliOutputOptions): void => {
  const { verbose } = commandOptions;

  if (verbose) {
    const messages = outputVerbose(report.failures, report.successes);

    log(messages.join('\n'));
  }

  const table = outputTable(report.failures, report.successes, options);

  if (!options || !options.table) {
    // if a table wasn't passed in, output table
    // otherwise let whatever passed the table in
    // manage outputting the table
    log(table.toString());
  }
};

export default cliOutput;
