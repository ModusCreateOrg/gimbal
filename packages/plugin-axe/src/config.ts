import { Meta } from '@/typings/module';

/* eslint-disable-next-line import/prefer-default-export */
export const meta: Meta = {
  capabilities: {
    remote: true,
  },
  thresholdLimit: 'upper',
  thresholdType: 'number',
};

export const type = 'axe';
