/* eslint-disable-next-line import/no-extraneous-dependencies */
import { Result } from 'axe-core';
import { AxePuppeteer } from 'axe-puppeteer';
import deepmerge from 'deepmerge';
import { Report, ReportItem } from '@/typings/command';
import { PluginOptions } from '@/typings/config/plugin';
import { Options } from '@/typings/module/registry';
import { defaultConfig, meta, type } from './config';
import { Config, ImpactMap, ThresholdValueString } from '../types';

const impactMap: ImpactMap = {
  none: 0,
  minor: 1,
  moderate: 2,
  serious: 3,
  critical: 4,
};

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
  threshold == null || !entry.impact ? true : impactMap[threshold] >= impactMap[entry.impact];

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
    value: entry.impact == null ? 'none' : entry.impact,
  };
};

const parseConfig = (moduleConfig: Config, config: Config): Config => {
  // if the config is passed, do not use default threshold at all
  const sourceConfig: Config = config.thresholds
    ? { ...defaultConfig, thresholds: { impact: 'none' } }
    : { ...defaultConfig };

  return deepmerge(deepmerge(moduleConfig, sourceConfig), config);
};

const Axe = async ({ context }: PluginOptions, configArg: Config): Promise<void> => {
  context.module.register(
    type,
    meta,
    async ({ chrome, config: auditConfig, url }: Options): Promise<Report> => {
      const page = await chrome.newPage();
      const config = parseConfig(configArg, auditConfig || {});

      if (page) {
        await page.setBypassCSP(true);

        await page.goto(url);

        const instance = new AxePuppeteer(page);

        if (config.disabledRules) {
          instance.disableRules(config.disabledRules);
        }

        if (config.exclude) {
          instance.exclude(config.exclude);
        }

        if (config.include) {
          instance.include(config.include);
        }

        if (config.rules) {
          instance.withRules(config.rules);
        }

        if (config.tags) {
          instance.withTags(config.tags);
        }

        const raw = await instance.analyze();
        const { passes, violations } = raw;
        const data: ReportItem[] = [
          ...(config.showSuccesses ? passes.map((entry: Result): ReportItem => parseEntry(entry, true, config)) : []),
          ...violations
            /**
             * Filter since violations may actually have passes in them.
             * Violations are not necessarily gimbal failures, they are
             * just axe violations at this point.
             */
            .filter((violation: Result) => Boolean(passes.find((pass: Result) => pass.id === violation.id) == null))
            .map((entry: Result): ReportItem => parseEntry(entry, false, config)),
        ];

        // need to sort since violations will be popped on the end
        data.sort((a: ReportItem, b: ReportItem): 0 | 1 | -1 => {
          if (a.label < b.label) {
            return -1;
          }

          if (a.label > b.label) {
            return 1;
          }

          return 0;
        });

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
