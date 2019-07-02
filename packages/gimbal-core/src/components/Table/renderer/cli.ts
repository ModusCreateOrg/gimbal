import Table, { Cell, HorizontalTable } from 'cli-table3';
import { Column, Data, RendererArgs } from '@/typings/components/Table';
import { sectionHeading } from '../../../utils/colors';
import Queue from '../../../utils/Queue';

const defaultConfig = {
  style: { head: ['white'] },
};

const renderItem = async (table: HorizontalTable, item: Data, index: number, columns: Column[]): Promise<void> => {
  if (item.data) {
    const { length: numColumns } = columns;
    const { label } = item;
    const column = columns[0];
    const content = column.renderer ? await column.renderer(label, item) : sectionHeading(label);

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
      const queue = new Queue();

      item.data.forEach((child: Data, childIndex: number): void =>
        queue.add((): Promise<void> => renderItem(table, child, childIndex, columns)),
      );

      await queue.run();
    }
  } else {
    const ret = await Promise.all(
      columns.map(
        async (column: Column): Promise<string | Cell> => {
          let { [column.key]: value } = item;

          if (value == null) {
            return '';
          }

          if (column.maxWidth && value.length > column.maxWidth) {
            value = `... ${value.substr(value.length - column.maxWidth)}`;
          }

          if (column.renderer) {
            value = await column.renderer(value, item);
          }

          if (column.align && column.align !== 'left') {
            return {
              content: value,
              hAlign: column.align,
            };
          }

          return value;
        },
      ),
    );

    table.push(ret);
  }
};

const renderCli = async ({ columns, data, options }: RendererArgs): Promise<string> => {
  const queue = new Queue();
  const table = new Table({
    ...defaultConfig,
    head: columns.map((column: Column): string => column.header),
    ...options,
  }) as HorizontalTable;

  data.forEach((item: Data, index: number): void =>
    queue.add((): Promise<void> => renderItem(table, item, index, columns)),
  );

  await queue.run();

  return table.toString();
};

export default renderCli;
