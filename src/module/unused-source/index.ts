import bytes from 'bytes';
import { CoverageEntry, Page } from 'puppeteer';
import Config from '@/config';
import {
  CoverageRange,
  Entry,
  UnusedRet,
  UnusedSourceConfig,
  UnusedSourceThreshold,
} from '@/typings/module/unused-source';
import defaultConfig from './default-config';

const NUMBER_RE = /^\d+$/;
const PERCENTAGE_RE = /^\d+%$/;

const checkThreshold = (size: number, percentage: number, threshold: UnusedSourceThreshold): boolean => {
  if (!Number.isNaN(threshold as number) || (threshold as string).match(NUMBER_RE)) {
    // threshold is a number either as a number or a string only containing digits
    return size > threshold;
  }

  if ((threshold as string).match(PERCENTAGE_RE)) {
    // threshold is a percentage as a string
    // remove % off end
    const thresholdNum = (threshold as string).substr((threshold as string).length - 1);

    return percentage > Number(thresholdNum);
  }

  // threshold is a byte string (like `10 KB`)
  const bytesThreshold = bytes(threshold as string);

  return size > bytesThreshold;
};

const UnusedCSS = async (
  page: Page,
  url: string,
  config: UnusedSourceConfig = Config.get('configs.unused-source', defaultConfig),
): Promise<UnusedRet> => {
  const sourceConfig = {
    ...defaultConfig,
    ...config,
  };

  await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);

  await page.goto(url);

  const [js, css]: [CoverageEntry[], CoverageEntry[]] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  let total = 0;
  let used = 0;

  const parsedCss = css.map(
    (entry: CoverageEntry): Entry => {
      const entryTotal = entry.text.length;
      let entryUsed = 0;

      total += entryTotal;

      entry.ranges.forEach(
        (range: CoverageRange): void => {
          const rangeValue = range.end - range.start - 1;

          entryUsed += rangeValue;
          used += rangeValue;
        },
      );

      const unused = total - entryUsed;
      const percentage = (unused / total) * 100;

      return {
        success: checkThreshold(unused, percentage, sourceConfig.threshold),
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
      let entryUsed = 0;

      total += entryTotal;

      entry.ranges.forEach(
        (range: CoverageRange): void => {
          const rangeValue = range.end - range.start - 1;

          entryUsed += rangeValue;
          used += rangeValue;
        },
      );

      const unused = total - entryUsed;
      const percentage = (unused / total) * 100;

      return {
        success: checkThreshold(unused, percentage, sourceConfig.threshold),
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

  return {
    css: parsedCss,
    js: parsedJs,
    success: checkThreshold(unused, percentage, sourceConfig.threshold),
    total,
    unused,
    unusedPercentage: percentage,
    used,
    url,
  };
};

export default UnusedCSS;
