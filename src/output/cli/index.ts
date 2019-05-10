import Table from '@/components/Table';
import { Report, ReportItem } from '@/typings/command';
import { Config, Data } from '@/typings/components/Table';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';
import { sectionHeading, successOrFailure } from '@/utils/colors';

const successColorizeRenderer = (value: Data, item: Data): string => successOrFailure(value, item.success);

export const createTable = (commandOptions: CommandOptions, config?: Config): Table => {
  const table = new Table({
    columns: [
      {
        header: 'Label',
        key: 'label',
        renderer: (label, item): string => {
          const { data, success } = item;

          if (data) {
            // bold the label part, colorify the success part
            const successText = successOrFailure(success ? '[ success: ✓ ]' : '[ success: x ]', success);

            return `${sectionHeading(label)} ${successText}`;
          }

          return successOrFailure(label, success);
        },
      },
      {
        header: 'Value',
        key: 'value',
        align: 'center',
        renderer: successColorizeRenderer,
      },
    ],
    ...config,
  });

  if (commandOptions.checkThresholds) {
    table.addColumn({
      header: 'Threshold',
      key: 'threshold',
      align: 'center',
      renderer: successColorizeRenderer,
    });

    table.addColumn({
      header: 'Success',
      key: 'success',
      align: 'center',
      renderer: (value: boolean | string): string => {
        if (value === true) {
          return successOrFailure('✓', value);
        }

        if (value === false) {
          return successOrFailure('x', value);
        }

        return value;
      },
    });
  }

  return table;
};

export const outputTable = (report: Report, commandOptions: CommandOptions, options?: CliOutputOptions): Table => {
  const table = options && options.table ? options.table : createTable(commandOptions);

  if (report.data) {
    report.data.forEach(
      (item: ReportItem): void => {
        // TODO handle grouped items
        table.add(item);
      },
    );
  }

  return table;
};
