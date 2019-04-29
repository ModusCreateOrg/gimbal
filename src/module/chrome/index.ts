import deepmerge from 'deepmerge';
import puppeteer, { Browser, Page } from 'puppeteer';
import { URL } from 'url';
import Config from '@/config';
import defaultConfig from './default-config';

class Chrome {
  private browser?: Browser;

  public get port(): string | void {
    if (this.browser) {
      const url: string = this.browser.wsEndpoint();

      return new URL(url).port;
    }

    return undefined;
  }

  public async launch(): Promise<void> {
    const config = deepmerge(defaultConfig, Config.get('configs.puppeteer') || {});

    this.browser = await puppeteer.launch(config);
  }

  public async kill(): Promise<void> {
    if (this.browser) {
      await this.browser.close();

      this.browser = undefined;
    }
  }

  public async newPage(): Promise<Page | void> {
    if (this.browser) {
      return this.browser.newPage();
    }

    return undefined;
  }
}

export default Chrome;
