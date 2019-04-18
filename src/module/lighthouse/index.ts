// @ts-ignore
import lighthouse from 'lighthouse';
import Config from '@/config';
import { Category, Config as LighthouseConfig, Options, Result } from '@/typings/module/lighthouse';
import checkThresholds from '@/utils/threshold';
import defaultConfig from './default-config';

const lighthouseRunner = async (
  url: string,
  options: Options,
  config: LighthouseConfig = Config.get('configs.lighthouse', defaultConfig),
): Promise<Result> => {
  const results = await lighthouse(
    url,
    {
      ...options,
      port: options.chromePort,
    },
    config,
  );

  return {
    ...results.lhr,
    success: checkThresholds(results.lhr.categories, config.threshold, {
      mode: 'above',
      parser: (obj: Category): number => obj.score * 100,
    }),
  };
};

export default lighthouseRunner;
