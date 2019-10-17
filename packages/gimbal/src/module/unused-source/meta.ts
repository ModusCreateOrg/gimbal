import { Meta } from '@/typings/module';

const meta: Meta = {
  capabilities: {
    browser: true,
    remote: true,
  },
  thresholdLimit: 'upper',
  thresholdType: 'percentage',
};

export default meta;
