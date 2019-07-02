// @ts-ignore
import stripAnsi from 'strip-ansi';
import { Column, RendererArgs } from '@/typings/components/Table';
import renderCli from './cli';

type AlignmentValues = '----' | ':---:' | '---:';

interface Alignment {
  center: AlignmentValues;
  left: AlignmentValues;
  right: AlignmentValues;
}

interface BorderItem {
  [name: string]: AlignmentValues;
}

const alignments: Alignment = {
  center: ':---:',
  left: '----',
  right: '---:',
};

const renderMarkdown = async ({ columns, data, options }: RendererArgs): Promise<string> => {
  const item: BorderItem = {
    label: alignments.left,
    rawLabel: alignments.left,
    threshold: alignments.center,
    success: alignments.center,
    value: alignments.center,
  };

  columns.forEach((column: Column): void => {
    const char = alignments[column.align || 'left'];

    item[column.key] = char;
  });

  data.unshift(item);

  return stripAnsi(await renderCli({ columns, data, options }));
};

export default renderMarkdown;
