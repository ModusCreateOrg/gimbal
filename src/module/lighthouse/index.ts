// @ts-ignore
import lighthouse from 'lighthouse';
import { launch, Options } from 'chrome-launcher';

interface LighthouseOptions {
  chromeOptions?: Options; // https://www.npmjs.com/package/chrome-launcher
  flags?: lighthouse.Flags[];
}

const lighthouseRunner = async (
  url: string,
  options: LighthouseOptions,
  config?: lighthouse.Config.Json,
): Promise<lighthouse.Result> => {
  const chrome = await launch(options.chromeOptions);

  try {
    const results = await lighthouse(
      url,
      {
        ...options,
        port: chrome.port,
      },
      config,
    );

    await chrome.kill();

    return results.lhr;
  } catch (e) {
    await chrome.kill();

    throw e;
  }
};

export default lighthouseRunner;
