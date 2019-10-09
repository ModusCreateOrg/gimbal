import deepmerge from 'deepmerge';
import minimatch from 'minimatch';
import { CoverageEntry, Page } from 'puppeteer';
import { URL } from 'url';
import Config from '@/config';
import EventEmitter from '@/event';
import { Report } from '@/typings/command';
import { SizeConfigs } from '@/typings/module/size';
import {
  CoverageRange,
  Entry,
  UnusedSourceConfig,
  AuditStartEvent,
  AuditEndEvent,
  AuditParseStartEvent,
  AuditParseEndEvent,
  NavigateStartEvent,
  NavigateEndEvent,
  ReportStartEvent,
  ReportEndEvent,
} from '@/typings/module/unused-source';
import { CommandOptions } from '@/typings/utils/command';
import defaultConfig from './default-config';
import parseReport from './output';

interface CheckThresholdRet {
  success: boolean;
  threshold?: string;
}

type EntryType = 'css' | 'js' | undefined;

const doThresholdMatch = (url: string, threshold: SizeConfigs): boolean => {
  const info = new URL(url);

  // use the pathname, not the whole url to make the
  // threshold path config simpler
  return minimatch(info.pathname, threshold.path);
};

const isThresholdMatch = (url: string, threshold: SizeConfigs, type?: EntryType): boolean => {
  // only attempt to find a match if both types match
  if (threshold.type === type) {
    return doThresholdMatch(url, threshold);
  }

  return !threshold.type && doThresholdMatch(url, threshold);
};

export const getThreshold = (url: string, thresholds: SizeConfigs[], type?: EntryType): string | void => {
  // attempt to find a matching threshold
  const threshold = thresholds.find((item: SizeConfigs): boolean => isThresholdMatch(url, item, type));

  if (threshold) {
    return threshold.maxSize;
  }

  // if no threshold was found, if there was a type passed, let's try
  // to find a threshold match that doesn't have a type on it.
  return type ? getThreshold(url, thresholds) : undefined;
};

export const checkThreshold = (percentage: number, threshold?: string): CheckThresholdRet => {
  if (threshold == null) {
    // if no threshold, then this is valid
    return {
      success: true,
    };
  }

  // threshold is a percentage as a string
  // remove % off end
  const thresholdNum = threshold.substr(0, threshold.length - 1);

  return {
    success: percentage <= Number(thresholdNum),
    threshold,
  };
};

export const getEntryUsed = (entry: CoverageEntry): number =>
  entry.ranges.reduce((used: number, range: CoverageRange): number => used + range.end - range.start - 1, 0);

const sortThreshold = (thresholds: SizeConfigs[]): SizeConfigs[] => {
  thresholds.sort((last: SizeConfigs, current: SizeConfigs): 0 | 1 | -1 => {
    if (last.type == null && current.type != null) {
      return 1;
    }
    if (last.type != null && current.type == null) {
      return -1;
    }

    if (last.type && current.type) {
      if (last.type < current.type) {
        return -1;
      }
      if (last.type > current.type) {
        return 1;
      }
    }

    return 0;
  });

  return thresholds;
};

const arrayMerge = (destinationArray: SizeConfigs[], sourceArray: SizeConfigs[]): SizeConfigs[] => {
  const newDestinationArray = destinationArray.slice();

  sourceArray.forEach((sourceItem: SizeConfigs): void => {
    const match = newDestinationArray.find((destItem: SizeConfigs): boolean => destItem.path === sourceItem.path &&  && destItem.type === sourceItem.type);

    if (match) {
      // apply config onto default
      Object.assign(match, sourceItem);
    } else {
      // is a new item
      newDestinationArray.push(sourceItem);
    }
  });

  return newDestinationArray;
};

const UnusedCSS = async (
  page: Page,
  url: string,
  options: CommandOptions,
  config: UnusedSourceConfig = Config.get('configs.unused-source', {}),
): Promise<Report> => {
  const { checkThresholds } = options;
  const sourceConfig = deepmerge(defaultConfig, config, {
    arrayMerge,
  });
  const isThresholdArray = Array.isArray(sourceConfig.threshold);
  const thresholds: string | SizeConfigs[] = isThresholdArray
    ? sortThreshold(sourceConfig.threshold as SizeConfigs[])
    : sourceConfig.threshold;

  const auditStartEvent: AuditStartEvent = {
    config: sourceConfig,
    options,
    page,
    url,
  };

  await EventEmitter.fire(`module/unused-source/audit/start`, auditStartEvent);

  await Promise.all([page.coverage.startCSSCoverage(), page.coverage.startJSCoverage()]);

  const navigateStartEvent: NavigateStartEvent = {
    config: sourceConfig,
    options,
    page,
    url,
  };

  await EventEmitter.fire(`module/unused-source/navigate/start`, navigateStartEvent);

  await page.goto(url);

  const navigateEndEvent: NavigateEndEvent = {
    config: sourceConfig,
    options,
    page,
    url,
  };

  await EventEmitter.fire(`module/unused-source/navigate/end`, navigateEndEvent);

  const [css, js]: [CoverageEntry[], CoverageEntry[]] = await Promise.all([
    page.coverage.stopCSSCoverage(),
    page.coverage.stopJSCoverage(),
  ]);

  const auditEndEvent: AuditEndEvent = {
    config: sourceConfig,
    css,
    js,
    options,
    page,
    url,
  };

  await EventEmitter.fire(`module/unused-source/audit/end`, auditEndEvent);

  let total = 0;
  let used = 0;

  const parseEntry = (type: EntryType): ((entry: CoverageEntry) => Entry) => (entry: CoverageEntry): Entry => {
    const entryTotal = entry.text.length;
    const entryUsed = getEntryUsed(entry);

    total += entryTotal;
    used += entryUsed;

    const unused = entryTotal - entryUsed;
    const percentage = (unused / entryTotal) * 100;
    const threshold = isThresholdArray
      ? getThreshold(entry.url, thresholds as SizeConfigs[], type)
      : (thresholds as string);
    const checked = checkThresholds ? checkThreshold(percentage, threshold as string) : { success: true };

    return {
      ...checked,
      rawEntry: entry,
      total: entryTotal,
      unused,
      unusedPercentage: `${percentage.toFixed(2)}%`,
      url: entry.url,
      used: entryUsed,
    };
  };

  const auditParseStartEvent: AuditParseStartEvent = {
    config: sourceConfig,
    css,
    js,
    options,
    page,
    url,
  };

  await EventEmitter.fire(`module/unused-source/audit/parse/start`, auditParseStartEvent);

  const parsedCss = css.map(parseEntry('css'));
  const parsedJs = js.map(parseEntry('js'));

  const unused = total - used;
  const percentage = (unused / total) * 100;
  const threshold = isThresholdArray ? getThreshold(url, thresholds as SizeConfigs[]) : (thresholds as string);
  const checked = checkThresholds ? checkThreshold(percentage, threshold as string) : { success: true };
  const pageTotal: Entry = {
    ...checked,
    total,
    unused,
    unusedPercentage: `${percentage.toFixed(2)}%`,
    url,
    used,
  };

  const auditParseEndEvent: AuditParseEndEvent = {
    config: sourceConfig,
    css,
    js,
    options,
    pageTotal,
    page,
    parsedCss,
    parsedJs,
    url,
  };

  await EventEmitter.fire(`module/unused-source/audit/parse/end`, auditParseEndEvent);

  const audit: Entry[] = [pageTotal, ...parsedCss, ...parsedJs];

  const reportStartEvent: ReportStartEvent = {
    audit,
    config,
    options,
    url,
  };

  await EventEmitter.fire(`module/unused-source/report/start`, reportStartEvent);

  const report = parseReport(audit, options);

  const reportEndEvent: ReportEndEvent = {
    audit,
    config,
    options,
    report,
    url,
  };

  await EventEmitter.fire(`module/unused-source/report/end`, reportEndEvent);

  return report;
};

export default UnusedCSS;
