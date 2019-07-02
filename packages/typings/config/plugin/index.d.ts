import { CommandOptions } from '@/typings/utils/command';

export interface PluginOptions {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  bus: (path: string) => any;
  commandOptions?: CommandOptions;
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
  plugin: string | Plugin;
}
