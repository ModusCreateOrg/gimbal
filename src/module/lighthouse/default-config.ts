import { Config } from '@/typings/module/lighthouse';

const defaultConfig: Config = {
  extends: 'lighthouse:default',
  settings: {
    skipAudits: ['uses-http2', 'redirects-http', 'uses-long-cache-ttl'],
  },
  threshold: {
    accessibility: 75,
    'best-practices': 95,
    performance: 95,
    pwa: 55,
    seo: 90,
  },
};

export default defaultConfig;
