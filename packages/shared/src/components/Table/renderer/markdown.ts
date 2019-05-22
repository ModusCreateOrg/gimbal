// @ts-ignore
import stripAnsi from 'strip-ansi';
import { RendererArgs } from '@/typings/components/Table';
import renderCli from './cli';

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
