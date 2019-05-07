import Table, { Cell, CellOptions, GenericTable, HorizontalTable, TableInstanceOptions } from 'cli-table3';
import deepmerge from 'deepmerge';
import { Report, ReportItem } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';
import { successOrFailure, sectionHeading } from '@/utils/colors';

const defaultConfig = {
  head: ['Label', 'Value'],
  style: { head: ['white'] },
};

export const createTable = (options: CommandOptions, extraConfig?: TableInstanceOptions): HorizontalTable => {
  const config = deepmerge(defaultConfig, extraConfig || {});

  if (options.checkThresholds) {
    config.head.push('Threshold', 'Success');
  }

  return new Table(config) as HorizontalTable;
};

/* eslint-disable-next-line import/prefer-default-export */
export const outputTable = (
  report: Report,
  commandOptions: CommandOptions,
  options?: CliOutputOptions,
): GenericTable<Cell[]> | void => {
  if (!report.data) {
    // TODO handle error?
    return undefined;
  }

  const { checkThresholds } = commandOptions;
  const table = options && options.table ? options.table : createTable(commandOptions);
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

      if (item.value != null) {
        const { value } = item;
        const valueString = value == null ? '' : value;

        const row: (string | CellOptions)[] = [item.label as string, valueString as string];

        if (checkThresholds) {
          const { threshold } = item;
          const thresholdString = threshold == null ? '' : threshold;

          row.push(thresholdString as string, successColumn as CellOptions);
        }

        table.push(successOrFailure(row, item.success) as CellOptions[]);
      } else {
        if (index > 0) {
          table.push([
            {
              content: '',
              colSpan: numColumns,
            },
          ]);
        }

        const row: (string | CellOptions)[] = [
          {
            content: sectionHeading(item.label),
            colSpan: checkThresholds ? numColumns - 1 : numColumns,
          },
        ];

        if (checkThresholds) {
          row.push(successColumn as CellOptions);
        }

        table.push(successOrFailure(row, item.success) as CellOptions[]);
      }

      if (item.data && item.data.length > 0) {
        outputTable(item, commandOptions, { table });
      }
    },
  );

  return table;
};
