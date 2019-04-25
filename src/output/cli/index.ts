import Table, { Cell, GenericTable, HorizontalTable } from 'cli-table3';
import { Report, ReportItem } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';

/* eslint-disable-next-line import/prefer-default-export */
export const outputTable = (report: Report, options?: CliOutputOptions): GenericTable<Cell[]> | void => {
  if (!report.data) {
    // TODO handle error?
    return undefined;
  }

  const table =
    options && options.table
      ? options.table
      : (new Table({ head: ['Label', 'Value', 'Threshold', 'Success'] }) as HorizontalTable);
  const {
    options: {
      head: { length: numColumns },
    },
  } = table;

  report.data.forEach(
    (item: ReportItem, index: number): void => {
      const successColumn: Cell = {
        content: item.success ? '' : 'x',
        hAlign: 'center',
      };

      if (item.threshold != null && item.value != null) {
        table.push([item.label, item.value, item.threshold, successColumn]);
      } else {
        if (index > 0) {
          table.push([
            {
              content: '',
              colSpan: numColumns,
            },
          ]);
        }

        table.push([
          {
            content: item.label,
            colSpan: numColumns - 1,
          },
          successColumn,
        ]);
      }

      if (item.data && item.data.length > 0) {
        outputTable(item, { table });
      }
    },
  );

  return table;
};
