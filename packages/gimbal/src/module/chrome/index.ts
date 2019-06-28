import deepmerge from 'deepmerge';
import puppeteer, { Browser, Page } from 'puppeteer';
import { URL } from 'url';
import Config from '@modus/gimbal-core/lib/config';
import EventEmitter from '@modus/gimbal-core/lib/event';
import {
  LaunchStartEvent,
  LaunchEndEvent,
  KillStartEvent,
  KillEndEvent,
  NewPageStartEvent,
  NewPageEndEvent,
} from '@/typings/module/chrome';
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

    const launchStartEvent: LaunchStartEvent = {
      config,
      mod: this,
    };

    await EventEmitter.fire(`module/puppeteer/launch/start`, launchStartEvent);

    const browser = await puppeteer.launch(config);

    const launchEndEvent: LaunchEndEvent = {
      browser,
      config,
      mod: this,
    };

    this.browser = browser;

    await EventEmitter.fire(`module/puppeteer/launch/end`, launchEndEvent);
  }

  public async kill(): Promise<void> {
    if (this.browser) {
      const killStartEvent: KillStartEvent = {
        browser: this.browser,
        mod: this,
      };

      await EventEmitter.fire(`module/puppeteer/kill/start`, killStartEvent);

      await this.browser.close();

      const killEndEvent: KillEndEvent = {
        mod: this,
      };

      await EventEmitter.fire(`module/puppeteer/kill/end`, killEndEvent);

      this.browser = undefined;
    }
  }

  public async newPage(): Promise<Page | void> {
    if (this.browser) {
      const newPageStartEvent: NewPageStartEvent = {
        browser: this.browser,
        mod: this,
      };

      await EventEmitter.fire(`module/puppeteer/new-page/start`, newPageStartEvent);

      const page = await this.browser.newPage();

      const newPageEndEvent: NewPageEndEvent = {
        browser: this.browser,
        mod: this,
        page,
      };

      await EventEmitter.fire(`module/puppeteer/new-page/end`, newPageEndEvent);

      return page;
    }

    return undefined;
  }
}

export default Chrome;
