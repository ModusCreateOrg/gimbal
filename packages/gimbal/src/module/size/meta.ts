import { Meta } from '@/typings/module';

const meta: Meta = {
  capabilities: {
    browser: false,
    remote: false,
  },
  maxNumRoutes: 1,
  thresholdLimit: 'upper',
  thresholdType: 'size',
};

export default meta;
