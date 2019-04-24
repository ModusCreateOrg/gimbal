import bytes from 'bytes';
import Table, { CellOptions, HorizontalTable } from 'cli-table3';
import { CommandReturn } from '@/typings/command';
import { Entry, UnusedRet } from '@/typings/module/unused-source';
import { CommandOptions } from '@/typings/utils/command';
import log from '@/utils/logger';
import { CliOutputOptions } from '@/typings/output/cli';
import { truncatePath } from '@/utils/string';

const bytesConfig = { unitSeparator: ' ' };

const formatUnused = (entry: Entry | UnusedRet): CellOptions => {
  const unused = entry.total - entry.used;
  const totalUnusedPercentage = ((unused / entry.total) * 100).toFixed(2);

  return {
    content: `${bytes(unused, bytesConfig)} (${totalUnusedPercentage}%)`,
    hAlign: 'right',
  };
};

const formatVerbose = (entry: Entry | UnusedRet): string =>
  `  Total: ${bytes(entry.total, bytesConfig)}  |  Used: ${bytes(entry.used, bytesConfig)}`;

const outputTable = (report: UnusedRet, verbose: boolean, options?: CliOutputOptions): HorizontalTable => {
  const table =
    options && options.table
      ? options.table
      : (new Table({ head: ['File URI', 'Unused Size', 'Threshold'] }) as HorizontalTable);

  table.push([{ colSpan: 3, content: 'Page Totals' }]);

  table.push([
    truncatePath(report.url),
    formatUnused(report),
    {
      content: report.threshold,
      hAlign: 'right',
    },
  ]);

  if (verbose) {
    table.push([{ colSpan: 3, content: formatVerbose(report) }]);
  }

  table.push([{ colSpan: 3, content: 'CSS' }]);

  if (report.css.length) {
    report.css.forEach(
      (entry: Entry): void => {
        table.push([
          truncatePath(entry.url),
          formatUnused(entry),
          {
            content: report.threshold,
            hAlign: 'right',
          },
        ]);

        if (verbose) {
          table.push([{ colSpan: 3, content: formatVerbose(entry) }]);
        }
      },
    );
  } else {
    table.push([{ colSpan: 3, content: '  none' }]);
  }

  table.push([{ colSpan: 3, content: 'JavaScript' }]);

  if (report.css.length) {
    report.js.forEach(
      (entry: Entry): void => {
        table.push([
          truncatePath(entry.url),
          formatUnused(entry),
          {
            content: report.threshold,
            hAlign: 'right',
          },
        ]);

        if (verbose) {
          table.push([{ colSpan: 3, content: formatVerbose(entry) }]);
        }
      },
    );
  } else {
    table.push([{ colSpan: 3, content: '  none' }]);
  }

  return table;
};

const cliOutput = (report: CommandReturn, commandOptions: CommandOptions, options?: CliOutputOptions): void => {
  const table = outputTable(report.data, commandOptions.verbose, options);

  if (!options || !options.table) {
    // if a table wasn't passed in, output table
    // otherwise let whatever passed the table in
    // manage outputting the table
    log(table.toString());
  }
};

export default cliOutput;
