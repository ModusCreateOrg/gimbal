// @ts-ignore
import lighthouse from 'lighthouse';

interface LighthouseOptions {
  chromePort: string;
  flags?: lighthouse.Flags[];
}

const lighthouseRunner = async (
  url: string,
  options: LighthouseOptions,
  config?: lighthouse.Config.Json,
): Promise<lighthouse.Result> => {
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
