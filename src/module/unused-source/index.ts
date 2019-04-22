import bytes from 'bytes';
import minimatch from 'minimatch';
import { CoverageEntry, Page } from 'puppeteer';
import { URL } from 'url';
import Config from '@/config';
import { SizeConfigs } from '@/typings/module/size';
import {
  CoverageRange,
  Entry,
  UnusedRet,
  UnusedSourceConfig,
  UnusedSourceThresholdSimple,
} from '@/typings/module/unused-source';
import defaultConfig from './default-config';

interface CheckThresholdRet {
  success: boolean;
  threshold?: UnusedSourceThresholdSimple;
}

const NUMBER_RE = /^\d+$/;
const PERCENTAGE_RE = /^\d+%$/;

const isThresholdMatch = (url: string, threshold: SizeConfigs, type?: 'css' | 'js'): boolean => {
  // only attempt to find a match if both types match
  if (threshold.type === type) {
    const info = new URL(url);

    // use the pathname, not the whole url to make the
    // threshold path config simpler
    return minimatch(info.pathname, threshold.path);
  }

  return false;
};

const getThreshold = (
  url: string,
  thresholds: SizeConfigs[],
  type?: 'css' | 'js',
): UnusedSourceThresholdSimple | void => {
  // attempt to find a matching threshold
  const threshold = thresholds.find((item: SizeConfigs): boolean => isThresholdMatch(url, item, type));

  if (threshold) {
    return threshold.maxSize;
  }

  // if no threshold was found, if there was a type passed, let's try
  // to find a threshold match that doesn't have a type on it.
  return type ? getThreshold(url, thresholds) : undefined;
};

const checkThreshold = (
  size: number,
  percentage: number,
  threshold: UnusedSourceThresholdSimple,
): CheckThresholdRet => {
  if (threshold == null) {
    // if no threshold, then this is valid
    return {
      success: true,
    };
  }

  const isString = typeof threshold === 'string';
  const isPercentage = isString && (threshold as string).match(PERCENTAGE_RE);
  const isNumber = !isPercentage && (!isString || (threshold as string).match(NUMBER_RE));

  if (isNumber) {
    // threshold is a number either as a number or a string only containing digits
    return {
      success: size < threshold,
      threshold,
    };
  }

  if (isPercentage) {
    // threshold is a percentage as a string
    // remove % off end
    const thresholdNum = (threshold as string).substr(0, (threshold as string).length - 1);

    return {
      success: percentage < Number(thresholdNum),
      threshold,
    };
  }

  // threshold is a byte string (like `10 KB`)
  const bytesThreshold = bytes(threshold as string);

  return {
    success: size < bytesThreshold,
    threshold,
  };
};

const getEntryUsed = (entry: CoverageEntry): number =>
  entry.ranges.reduce((used: number, range: CoverageRange): number => used + range.end - range.start - 1, 0);

const UnusedCSS = async (
  page: Page,
  url: string,
  config: UnusedSourceConfig = Config.get('configs.unused-source', defaultConfig),
): Promise<UnusedRet> => {
  const sourceConfig = {
    ...defaultConfig,
    ...config,
  };
  const isThresholdArray = Array.isArray(sourceConfig.threshold);

  await Promise.all([page.coverage.startCSSCoverage(), page.coverage.startJSCoverage()]);

  await page.goto(url);

  const [css, js]: [CoverageEntry[], CoverageEntry[]] = await Promise.all([
    page.coverage.stopCSSCoverage(),
    page.coverage.stopJSCoverage(),
  ]);

  let total = 0;
  let used = 0;

  const parsedCss = css.map(
    (entry: CoverageEntry): Entry => {
      const entryTotal = entry.text.length;
      const entryUsed = getEntryUsed(entry);

      total += entryTotal;
      used += entryUsed;

      const unused = entryTotal - entryUsed;
      const percentage = (unused / entryTotal) * 100;
      const threshold = isThresholdArray
        ? getThreshold(entry.url, sourceConfig.threshold as SizeConfigs[], 'css')
        : sourceConfig.threshold;
      const checked = checkThreshold(unused, percentage, threshold as UnusedSourceThresholdSimple);

      return {
        ...checked,
        total: entryTotal,
        unused,
        unusedPercentage: percentage,
        url: entry.url,
        used: entryUsed,
      };
    },
  );

  const parsedJs = js.map(
    (entry: CoverageEntry): Entry => {
      const entryTotal = entry.text.length;
      const entryUsed = getEntryUsed(entry);

      total += entryTotal;
      used += entryUsed;

      const unused = entryTotal - entryUsed;
      const percentage = (unused / entryTotal) * 100;
      const threshold = isThresholdArray
        ? getThreshold(entry.url, sourceConfig.threshold as SizeConfigs[], 'js')
        : sourceConfig.threshold;
      const checked = checkThreshold(unused, percentage, threshold as UnusedSourceThresholdSimple);

      return {
        ...checked,
        total: entryTotal,
        unused,
        unusedPercentage: percentage,
        url: entry.url,
        used: entryUsed,
      };
    },
  );

  const unused = total - used;
  const percentage = (unused / total) * 100;
  const threshold = isThresholdArray
    ? getThreshold(url, sourceConfig.threshold as SizeConfigs[])
    : sourceConfig.threshold;
  const checked = checkThreshold(unused, percentage, threshold as UnusedSourceThresholdSimple);

  return {
    ...checked,
    total,
    unused,
    unusedPercentage: percentage,
    used,
    url,
    css: parsedCss,
    js: parsedJs,
  };
};

export default UnusedCSS;
