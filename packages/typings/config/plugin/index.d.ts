import { ParsedArgs } from 'minimist';

export interface PluginOptions {
  args?: ParsedArgs;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  bus: (path: string) => any;
  dir: string;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type PluginFunction = (options: PluginOptions, config: Config) => any;

export interface Plugin {
  default: PluginFunction;
}

export interface Config {
  name: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

export interface PluginConfig extends Config {
  enabled?: boolean;
  plugin: string | Plugin;
}
