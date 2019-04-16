import { CoverageEntry, Page } from 'puppeteer';
import { Entry, CoverageRange, UnusedRet } from '@/typings/module/unused-source';

class UnusedCSS {
  public async calculate(page: Page, url: string): Promise<UnusedRet> {
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

        return {
          ...entry,
          total: entryTotal,
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

        return {
          ...entry,
          total: entryTotal,
          used: entryUsed,
        };
      },
    );

    return {
      css: parsedCss,
      js: parsedJs,
      total,
      used,
      url,
    };
  }
}

export default UnusedCSS;
