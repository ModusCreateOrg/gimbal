import { Meta } from '@/typings/module';

const meta: Meta = {
  capabilities: {
    remote: true,
  },
  thresholdLimit: 'lower',
  thresholdTypes: {
    Accessibility: 'number',
    'Best Practices': 'number',
    Performance: 'number',
    pwa: 'number',
    seo: 'number',
  },
};

export default meta;
