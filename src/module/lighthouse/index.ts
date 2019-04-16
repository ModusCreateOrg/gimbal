// @ts-ignore
import lighthouse from 'lighthouse';
import Config from '@/config';
import { Result } from '@/typings/module/lighthouse';

const defaultConfig: lighthouse.Config.Json = {
  extends: 'lighthouse:default',
  settings: {
    skipAudits: ['uses-http2', 'redirects-http', 'uses-long-cache-ttl'],
  },
};

interface LighthouseOptions {
  chromePort: string;
  flags?: lighthouse.Flags[];
}

const lighthouseRunner = async (
  url: string,
  options: LighthouseOptions,
  config: lighthouse.Config.Json = Config.get('configs.lighthouse', defaultConfig),
): Promise<Result> => {
  const results = await lighthouse(
    url,
    {
      ...options,
      port: options.chromePort,
    },
    config,
  );

  return results.lhr;
};

export default lighthouseRunner;
