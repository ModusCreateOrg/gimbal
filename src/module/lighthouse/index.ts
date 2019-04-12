// @ts-ignore
import lighthouse from 'lighthouse';
import { Result } from '@/typings/module/lighthouse';

interface LighthouseOptions {
  chromePort: string;
  flags?: lighthouse.Flags[];
}

const lighthouseRunner = async (
  url: string,
  options: LighthouseOptions,
  config?: lighthouse.Config.Json,
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
