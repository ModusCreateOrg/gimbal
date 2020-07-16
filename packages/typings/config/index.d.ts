import { Plugin } from './plugin';
import { Config as v1config } from './versions/1';
import { Config as v2config } from './versions/2';

import { Context } from '../context/index';

export type PluginType = string | Plugin;
export type RawConfig = v1config | v2config;

// this is to reexport latest version
export * from './versions/2';

export type LoaderFn = (file: string) => Promise<RawConfig>;

export interface LoaderMap {
  js: LoaderFn;
  json: LoaderFn;
  yaml: LoaderFn;
  yml: LoaderFn;
  [name: string]: LoaderFn;
}

export interface LoadStartEvent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Config: any; // would cause circular dependency if imported the command class
  context: Context;
  dir: string;
  file: string;
  force: boolean;
}

export interface LoadEndEvent extends LoadStartEvent {
  config: v2config;
}
