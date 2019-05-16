import { LaunchOptions } from 'puppeteer';

// can accept anything from: https://github.com/GoogleChrome/puppeteer/blob/v1.14.0/docs/api.md#puppeteerlaunchoptions
const defaultConfig: LaunchOptions = {
  // args useful for headless CI instances
  args: ['--no-sandbox', '–-disable-setuid-sandbox'],
};

export default defaultConfig;
