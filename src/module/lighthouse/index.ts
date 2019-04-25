// @ts-ignore
import lighthouse from 'lighthouse';
import Config from '@/config';
import { Report } from '@/typings/command';
import { Config as LighthouseConfig, Options } from '@/typings/module/lighthouse';
import defaultConfig from './default-config';
import parseReport from './output';

const lighthouseRunner = async (
  url: string,
  options: Options,
  config: LighthouseConfig = Config.get('configs.lighthouse', defaultConfig),
): Promise<Report> => {
  const results = await lighthouse(
    url,
    {
      ...options,
      port: options.chromePort,
    },
    config,
  );

  return parseReport(results.lhr, config);
};

export default lighthouseRunner;
