import { TableInstanceOptions } from 'cli-table3';
import { createTable } from '../cli';
import { Report, ReportItem } from '@/typings/command';
import { Config } from '@/typings/components/Table';
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

const tableConfig: Config = {
  options: markdownTableOptions as TableInstanceOptions,
};

export const outputTable = (report: Report, commandOptions: CommandOptions, options?: CliOutputOptions): string => {
  const table = options && options.table ? options.table : createTable(commandOptions, tableConfig);

  if (report.data) {
    report.data.forEach(
      (item: ReportItem): void => {
        if (item.value != null) {
          table.add(item);
        }
      },
    );
  }

  return table.render('markdown');
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

  return markdown;
};

export default MarkdownOutput;
