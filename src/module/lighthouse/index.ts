// @ts-ignore
import lighthouse from 'lighthouse';
import Config from '@/config';
import { Report } from '@/typings/command';
import { Config as LighthouseConfig, Options } from '@/typings/module/lighthouse';
import { CommandOptions } from '@/typings/utils/command';
import defaultConfig from './default-config';
import parseReport from './output';

const lighthouseRunner = async (
  url: string,
  options: Options,
  commandOptions: CommandOptions,
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

  return parseReport(results.lhr, config, commandOptions);
};

export default lighthouseRunner;
