import Table, { HorizontalTable } from 'cli-table3';
import { Column, Data, RendererArgs } from '@/typings/components/Table';
import { sectionHeading } from '@/utils/colors';

const defaultConfig = {
  style: { head: ['white'] },
};

const renderItem = (table: HorizontalTable, item: Data, index: number, columns: Column[]): void => {
  if (item.data) {
    const { length: numColumns } = columns;
    const { label } = item;
    const column = columns[0];
    const content = column.renderer ? column.renderer(label, item) : sectionHeading(label);

    if (index > 0) {
      // put a spacer above group headers (except for the first)
      table.push([
        {
          content: '',
          colSpan: numColumns,
        },
      ]);
    }

    table.push([
      {
        content,
        colSpan: numColumns,
      },
    ]);

    if (item.data.length) {
      item.data.forEach((child: Data, childIndex: number): void => renderItem(table, child, childIndex, columns));
    }
  } else {
    table.push(
      columns.map(
        (column: Column): string => {
          let { [column.key]: value } = item;

          if (column.renderer) {
            value = column.renderer(value, item);
          }

          return value == null ? '' : value;
        },
      ),
    );
  }
};

const renderCli = ({ columns, data, options }: RendererArgs): string => {
  const table = new Table({
    ...defaultConfig,
    head: columns.map((column: Column): string => column.header),
    ...options,
  }) as HorizontalTable;

  data.forEach((item: Data, index: number): void => renderItem(table, item, index, columns));

  return table.toString();
};

export default renderCli;
