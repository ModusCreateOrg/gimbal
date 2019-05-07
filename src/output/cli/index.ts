import Table, { Cell, CellOptions, GenericTable, HorizontalTable } from 'cli-table3';
import { Report, ReportItem } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';
import { successOrFailure, sectionHeading } from '@/utils/colors';

const defaultConfig = {
  head: ['Label', 'Value', 'Threshold', 'Success'],
  style: { head: ['white'] },
};

/* eslint-disable-next-line import/prefer-default-export */
export const outputTable = (report: Report, options?: CliOutputOptions): GenericTable<Cell[]> | void => {
  if (!report.data) {
    // TODO handle error?
    return undefined;
  }

  const table = options && options.table ? options.table : (new Table(defaultConfig) as HorizontalTable);
  const {
    options: {
      head: { length: numColumns },
    },
  } = table;

  report.data.forEach(
    (item: ReportItem, index: number): void => {
      const successColumn: CellOptions = {
        content: item.success ? '✓' : 'x',
        hAlign: 'center',
      };

      if (item.threshold != null && item.value != null) {
        table.push(successOrFailure(
          [item.label as string, item.value as string, item.threshold as string, successColumn as CellOptions],
          item.success,
        ) as CellOptions[]);
      } else {
        if (index > 0) {
          table.push([
            {
              content: '',
              colSpan: numColumns,
            },
          ]);
        }

        table.push(successOrFailure(
          [
            {
              content: sectionHeading(item.label),
              colSpan: numColumns - 1,
            },
            successColumn,
          ],
          item.success,
        ) as CellOptions[]);
      }

      if (item.data && item.data.length > 0) {
        outputTable(item, { table });
      }
    },
  );

  return table;
};
