import { Meta } from '@/typings/module';

const meta: Meta = {
  capabilities: {
    remote: false,
  },
  maxNumRoutes: 1,
  thresholdLimit: 'upper',
  thresholdType: 'size',
};

export default meta;
