import envOrDefault from '@modus/gimbal-core/lib/utils/env';
import { LaunchOptions } from 'puppeteer';

// can accept anything from: https://github.com/GoogleChrome/puppeteer/blob/v1.14.0/docs/api.md#puppeteerlaunchoptions
const defaultConfig: LaunchOptions = {
  // args useful for headless CI instances
  args: ['--no-sandbox', '–-disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
};

const CHROME_BIN = envOrDefault('CHROME_BIN');

if (CHROME_BIN) {
  defaultConfig.executablePath = CHROME_BIN;
}

export default defaultConfig;
