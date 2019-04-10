import puppeteer, { Browser, Page } from 'puppeteer';
import { URL } from 'url';

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
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
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
