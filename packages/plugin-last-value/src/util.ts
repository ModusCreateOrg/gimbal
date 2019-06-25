import checkThreshold, { isPercentage, percentToNumber } from '@modus/gimbal-core/lib/utils/threshold';
import { Meta, Types } from '@/typings/module';
import { Config, ItemFailReasons, LastReportItem } from '@/typings/plugin/last-value';
import { DiffRet, Metas } from '@/typings/plugin/last-value/util';

const getNumberDiff = (item: LastReportItem): DiffRet => {
  const lastValue = Number(item.rawLastValue);
  const diff = Math.abs(lastValue - (item.rawValue as number));
  const change = (diff / (item.rawValue as number)) * 100;

  return { change, diff };
};

const getPercentageDiff = (item: LastReportItem): DiffRet => {
  const lastValue = isPercentage(item.rawLastValue as string)
    ? percentToNumber(item.rawLastValue as string)
    : (item.rawLastValue as number);
  const value = isPercentage(item.rawValue as string)
    ? percentToNumber(item.rawValue as string)
    : (item.rawValue as number);
  const diff = Math.abs(lastValue - value);
  const change = (diff / (item.rawValue as number)) * 100;

  return { change, diff };
};

const getSizeDiff = (item: LastReportItem): DiffRet => getNumberDiff(item);

const checkDiff = (
  item: LastReportItem,
  diff: number,
  numberThreshold: number,
  percentageThreshold: number,
  numberRet: string,
  percentageRet: string,
  meta: Meta,
): ItemFailReasons => {
  // if the diff is within the threshold, check % of diff vs last value
  if (checkThreshold(diff, numberThreshold, meta.thresholdLimit)) {
    const rawValue = isPercentage(item.rawValue as string)
      ? percentToNumber(item.rawValue as string)
      : (item.rawValue as number);
    const percentDiff = (diff / rawValue) * 100;

    return checkThreshold(percentDiff, percentageThreshold) ? false : percentageRet;
  }

  return numberRet;
};

const checkNumberThreshold = (item: LastReportItem, config: Config, meta: Meta): ItemFailReasons => {
  const { thresholds } = config;
  const { diff } = getNumberDiff(item);

  return checkDiff(item, diff, thresholds.number, thresholds.diffPercentage, 'number', 'numberDiffPercentage', meta);
};

const checkPercentageThreshold = (item: LastReportItem, config: Config, meta: Meta): ItemFailReasons => {
  const { thresholds } = config;
  const { diff } = getPercentageDiff(item);

  return checkDiff(
    item,
    diff,
    thresholds.percentage,
    thresholds.diffPercentage,
    'percentage',
    'percentageDiffPercentage',
    meta,
  );
};

const checkSizeThreshold = (item: LastReportItem, config: Config, meta: Meta): ItemFailReasons => {
  const { thresholds } = config;
  const { diff } = getSizeDiff(item);

  return checkDiff(item, diff, thresholds.size, thresholds.diffPercentage, 'size', 'sizeDiffPercentage', meta);
};

const getThresholdType = (item: LastReportItem, metaMap: Metas): Types | void => {
  const meta = metaMap[item.type];
  let { thresholdType } = meta;
  const { thresholdTypes } = meta;

  if (!thresholdType && thresholdTypes) {
    thresholdType = thresholdTypes[item.rawLabel];
  }

  return thresholdType;
};

export const getItemDiff = (item: LastReportItem, metaMap: Metas): void | DiffRet => {
  const thresholdType = getThresholdType(item, metaMap);

  switch (thresholdType) {
    case 'number':
      return getNumberDiff(item);
    case 'percentage':
      return getPercentageDiff(item);
    case 'size':
      return getSizeDiff(item);
    default:
      return undefined;
  }
};

/* eslint-disable-next-line import/prefer-default-export */
export const doesItemFail = (item: LastReportItem, config: Config, metaMap: Metas): ItemFailReasons => {
  if (item.lastValue == null || item.rawValue === item.rawLastValue) {
    return false;
  }

  const meta = metaMap[item.type];
  const thresholdType = getThresholdType(item, metaMap);

  switch (thresholdType) {
    case 'number':
      return checkNumberThreshold(item, config, meta);
    case 'percentage':
      return checkPercentageThreshold(item, config, meta);
    case 'size':
      return checkSizeThreshold(item, config, meta);
    default:
      return false;
  }
};
