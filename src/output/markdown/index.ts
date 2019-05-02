import Table, { HorizontalTable } from 'cli-table3';
import stripAnsi from 'strip-ansi';
import { Report, ReportItem } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';

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

export const outputTable = (report: Report, options?: CliOutputOptions): string | void => {
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

  return stripAnsi(table.toString());
};

const MarkdownOutput = (report: Report): string => {
  if (!report.data) {
    return '';
  }

  let markdown = '# Gimbal Report';

  report.data.forEach(
    (item: ReportItem): void => {
      markdown = `${markdown}

## ${item.label}

${outputTable(item)}`;
    },
  );

  return stripAnsi(markdown);
};

export default MarkdownOutput;
