import { Browser, LaunchOptions, Page } from 'puppeteer';

export interface LaunchStartEvent {
  config: LaunchOptions;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
}

export interface LaunchEndEvent {
  browser: Browser;
  config: LaunchOptions;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
}

export interface KillStartEvent {
  browser: Browser;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
}

export interface KillEndEvent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
}

export interface NewPageStartEvent {
  browser: Browser;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
}

export interface NewPageEndEvent {
  browser: Browser;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
  page: Page;
}
