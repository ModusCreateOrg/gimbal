import stripAnsi from 'strip-ansi';
import renderCli from '@/components/Table/renderer/cli';
import { RendererArgs } from '@/typings/components/Table';

const renderMarkdown = ({ columns, data, options }: RendererArgs): string => {
  data.unshift({
    label: '----',
    rawLabel: '----',
    threshold: ':---:',
    success: ':---:',
    value: ':---:',
  });

  return stripAnsi(renderCli({ columns, data, options }));
};

export default renderMarkdown;
