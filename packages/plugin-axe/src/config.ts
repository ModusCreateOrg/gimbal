import { Meta } from '@/typings/module';

export const defaultConfig = {
  showSuccesses: true,
  thresholds: {
    impact: 'none',
  },
};

/* eslint-disable-next-line import/prefer-default-export */
export const meta: Meta = {
  capabilities: {
    browser: true,
    remote: true,
  },
  thresholdLimit: 'upper',
  thresholdType: 'number',
};

export const type = 'axe';
