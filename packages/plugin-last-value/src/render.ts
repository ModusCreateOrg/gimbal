import bytes from 'bytes';
import { doesItemFail } from './util';
import { Table } from '@/typings/components/Table';
import { Config, LastReportItem } from '@/typings/plugin/last-value';
import { Metas } from '@/typings/plugin/last-value/util';

type Renderer = (lastValue: number | string | void, item: LastReportItem) => string;

const bytesConfig = {
  unitSeparator: ' ',
};

const decimalize = (value: number): string => (value % 1 ? value.toFixed(2) : `${value}`);

export const renderDiffPercentage = (lastValue: string, item: LastReportItem): string => {
  const { lastValueChange, lastValueDiff } = item;

  if (lastValueChange && lastValueDiff) {
    const diffPrefix = lastValueDiff > 0 ? '+' : '';

    return `${lastValue}
  ${diffPrefix}${decimalize(lastValueChange)}%`;
  }

  return lastValue;
};

export const renderDifference = (lastValue: number, item: LastReportItem): string => {
  const diff = item.lastValueDiff;

  if (diff) {
    const diffPrefix = diff > 0 ? '+' : '';

    return `${lastValue}
  ${diffPrefix}${bytes(diff, bytesConfig)}`;
  }

  return `${lastValue}`;
};

export const createRenderer = (config: Config, metaMap: Metas): Renderer => (
  lastValue: number | string | void,
  item: LastReportItem,
): string => {
  const failure = doesItemFail(item, config, metaMap);

  switch (failure) {
    case 'number':
    case 'percentage':
    case 'size':
      return renderDifference(lastValue as number, item);
    case 'numberDiffPercentage':
    case 'percentageDiffPercentage':
    case 'sizeDiffPercentage':
      return renderDiffPercentage(lastValue as string, item);
    default:
      return lastValue == null ? '' : `${lastValue}`;
  }
};

export const addColumn = (table: Table | void, config: Config, metaMap: Metas): void => {
  if (table) {
    const index = (table.findColumn((column): boolean => column.header === 'Value', true) as number) + 1;

    table.addColumn(
      {
        header: 'Last Value',
        key: 'lastValue',
        align: 'center',
        renderer: createRenderer(config, metaMap),
      },
      index,
    );
  }
};
