import { Page } from 'puppeteer';
import { UnusedCSSRet } from '@/typings/module/chrome/UnusedCSS';

interface StylesheetHeader {
  disabled: boolean;
  frameId: string;
  isInline: boolean;
  length: number;
  origin: string;
  ownerNode: number;
  sourceMapURL: string;
  sourceURL: string;
  startColumn: number;
  startLine: number;
  styleSheetId: string;
  title: string;
}

interface Stylesheet {
  header: StylesheetHeader;
}

interface Rule {
  endOffset: number;
  startOffset: number;
  styleSheetId: string;
  used: boolean;
}

class UnusedCSS {
  public async calculate(page: Page, url?: string): Promise<UnusedCSSRet | void> {
    const client = await page.target().createCDPSession();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('CSS.enable');

    await client.send('CSS.startRuleUsageTracking');

    const stylesheets: StylesheetHeader[] = [];

    client.on(
      'CSS.styleSheetAdded',
      (stylesheet: Stylesheet): void => {
        stylesheets.push(stylesheet.header);
      },
    );

    if (url) {
      await page.goto(url);
    }

    const { ruleUsage }: { ruleUsage?: Rule[] } = await client.send('CSS.stopRuleUsageTracking');

    if (ruleUsage) {
      return this.calcUnusedCssPercentage(stylesheets, ruleUsage);
    }

    return undefined;
  }

  private calcUnusedCssPercentage(stylesheets: StylesheetHeader[], ruleUsage: Rule[]): UnusedCSSRet {
    let i = 0;
    let totalLength = 0;
    let usedLength = 0;

    while (i < stylesheets.length) {
      const stylesheet = stylesheets[i];

      totalLength += stylesheet.length;
      usedLength += this.calcUsedLength(ruleUsage, stylesheet);

      i += 1;
    }

    return {
      totalLength,
      unusedLength: totalLength - usedLength,
      unusedPercentage: 100 - Math.round((usedLength / totalLength) * 100),
      usedLength,
    };
  }

  private calcUsedLength(ruleUsage: Rule[], stylesheet: StylesheetHeader): number {
    const stylesheetRuleUsages = ruleUsage.filter(
      (rule: Rule): boolean => rule.styleSheetId === stylesheet.styleSheetId,
    );

    return stylesheetRuleUsages.reduce((sum: number, rule: Rule): number => sum + rule.endOffset - rule.startOffset, 0);
  }
}

export default UnusedCSS;
