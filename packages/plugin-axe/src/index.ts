/* eslint-disable-next-line import/no-extraneous-dependencies */
import { ImpactValue, Result } from 'axe-core';
import { AxePuppeteer } from 'axe-puppeteer';
import deepmerge from 'deepmerge';
import { Report, ReportItem } from '@/typings/command';
import { PluginOptions } from '@/typings/config/plugin';
import { Options } from '@/typings/module/registry';

type ThresholdValueString = ImpactValue | 'none';

interface Config {
  disabledRules?: string | string[];
  exclude?: string | string[];
  include?: string | string[];
  rules?: string | string[];
  showSuccesses: boolean;
  tags?: string | string[];
  thresholds: {
    impact: number | ThresholdValueString;
    [name: string]: number | ThresholdValueString;
  };
}

type ImpactMap = {
  [key in ThresholdValueString]: number;
};

const defaultConfig: Config = {
  showSuccesses: true,
  thresholds: {
    impact: 'none',
  },
};

const impactMap: ImpactMap = {
  none: 0,
  minor: 1,
  moderate: 2,
  serious: 3,
  critical: 4,
};

const type = 'axe';

const getThreshold = (entry: Result, { thresholds }: Config): ThresholdValueString => {
  const threshold = thresholds[entry.id] || thresholds.impact;

  if (typeof threshold === 'number') {
    const keys = Object.keys(impactMap) as ThresholdValueString[];
    const match = keys.find((key: ThresholdValueString): boolean => threshold === impactMap[key]);

    return match || (thresholds.impact as ThresholdValueString);
  }

  return threshold;
};

const isSuccessful = (entry: Result, threshold: ThresholdValueString): boolean =>
  threshold == null ? true : impactMap[threshold] >= impactMap[entry.impact];

const parseEntry = (entry: Result, success: boolean, config: Config): ReportItem => {
  const threshold = getThreshold(entry, config);

  return {
    label: entry.id,
    rawLabel: entry.id,
    rawThreshold: threshold,
    rawValue: entry.impact,
    success: success || isSuccessful(entry, threshold),
    thresholdLimit: 'upper',
    threshold,
    type,
    value: entry.impact == null ? '' : entry.impact,
  };
};

const Axe = async ({ bus }: PluginOptions, config: Config): Promise<void> => {
  const pluginConfig = deepmerge(defaultConfig, config);

  const { register } = await bus('module/registry');

  register(
    type,
    {
      thresholdLimit: 'upper',
      thresholdType: 'number',
    },
    async ({ chrome, url }: Options): Promise<Report> => {
      const page = await chrome.newPage();

      if (page) {
        await page.setBypassCSP(true);

        await page.goto(url);

        const instance = new AxePuppeteer(page);

        if (pluginConfig.disabledRules) {
          instance.disableRules(pluginConfig.disabledRules);
        }

        if (pluginConfig.exclude) {
          instance.exclude(pluginConfig.exclude);
        }

        if (pluginConfig.include) {
          instance.include(pluginConfig.include);
        }

        if (pluginConfig.rules) {
          instance.withRules(pluginConfig.rules);
        }

        if (pluginConfig.tags) {
          instance.withTags(pluginConfig.tags);
        }

        const raw = await instance.analyze();
        const { passes, violations } = raw;
        const data = [
          ...(pluginConfig.showSuccesses
            ? passes.map((entry: Result): ReportItem => parseEntry(entry, true, pluginConfig))
            : []),
          ...violations.map((entry: Result): ReportItem => parseEntry(entry, false, pluginConfig)),
        ];
        const success = data.every((item: ReportItem): boolean => item.success);

        await page.close();

        return {
          data: [
            {
              data,
              label: 'Axe Audits',
              rawLabel: 'Axe Audits',
              success,
              type,
            },
          ],
          raw,
          success,
        };
      }

      throw new Error('Could not open page to analyze with axe');
    },
  );
};

export default Axe;
