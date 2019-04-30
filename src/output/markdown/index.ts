import Table, { Cell, GenericTable, HorizontalTable } from 'cli-table3';
import { Report, ReportItem } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';
import fs from 'fs';
import stripAnsi from 'strip-ansi';

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

const outputTable = (report: Report, options?: CliOutputOptions): GenericTable<Cell[]> | void => {
  if (!report.data) {
    // TODO handle error?
    return undefined;
  }

  const table =
    options && options.table
      ? options.table
      : (new Table({ ...markdownTableOptions, head: ['Label', 'Value', 'Threshold', 'Success'] }) as HorizontalTable);

  table.push(['----', ':---:', ':---:', ':---:']);

  report.data.forEach(
    (item: ReportItem): void => {
      if (item.threshold != null && item.value != null) {
        table.push([item.label, item.value, item.threshold, item.success ? '✓' : 'x']);
      }
    },
  );

  return table;
};

/* eslint-disable-next-line consistent-return */
const MarkdownOutput = (file: string, report: Report): boolean => {
  if (!report.data) {
    // TODO handle error?
    return false;
  }

  let markdown = '# Gimbal Report';

  report.data.forEach(
    (item: ReportItem): void => {
      markdown = `${markdown}

## ${item.label}

${outputTable(item)}`;
    },
  );

  if (markdown) {
    try {
      fs.writeFileSync(file, stripAnsi(markdown), 'utf8');

      return true;
    } catch {
      return false;
    }
  }

  return false;
};

export default MarkdownOutput;
