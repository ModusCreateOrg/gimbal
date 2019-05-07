import { TableInstanceOptions } from 'cli-table3';
import stripAnsi from 'strip-ansi';
import { createTable } from '../cli';
import { Report, ReportItem } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';

const markdownTableOptions = {
  chars: {
    top: '',
    'top-mid': '',
    'top-left': '',
    'top-right': '',
    bottom: '',
    'bottom-mid': '',
    'bottom-left': '',
    'bottom-right': '',
    left: '|',
    'left-mid': '',
    mid: '',
    'mid-mid': '',
    right: '|',
    'right-mid': '',
    middle: '|',
  },
};

export const outputTable = (
  report: Report,
  commandOptions: CommandOptions,
  options?: CliOutputOptions,
): string | void => {
  if (!report.data) {
    // TODO handle error?
    return undefined;
  }

  const { checkThresholds } = commandOptions;

  const table =
    options && options.table
      ? options.table
      : createTable(commandOptions, markdownTableOptions as TableInstanceOptions);
  const borderRow = ['----', ':---:'];

  if (checkThresholds) {
    borderRow.push(':---:', ':---:');
  }

  table.push(borderRow);

  report.data.forEach(
    (item: ReportItem): void => {
      if (item.value != null) {
        const row = [item.label, item.value];

        if (checkThresholds) {
          row.push(item.threshold as string, item.success ? '✓' : 'x');
        }

        table.push(row);
      }
    },
  );

  return stripAnsi(table.toString());
};

const MarkdownOutput = (report: Report, commandOptions: CommandOptions): string => {
  if (!report.data) {
    return '';
  }

  let markdown = '# Gimbal Report';

  report.data.forEach(
    (item: ReportItem): void => {
      markdown = `${markdown}

## ${item.label}

${outputTable(item, commandOptions)}`;
    },
  );

  return stripAnsi(markdown);
};

export default MarkdownOutput;
