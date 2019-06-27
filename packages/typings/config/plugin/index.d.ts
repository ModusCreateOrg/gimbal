import { Command } from 'commander';
import { Emitter } from '@/typings/event';
import { ResolvePath } from '@/typings/utils/fs';
import { CommandOptions, GetOptionsFromCommand } from '@/typings/utils/command';
import { EnvOrDefault } from '@/typings/utils/env';

export interface PluginOptions {
  commandOptions?: CommandOptions;
  dir: string;
  event: Emitter;
  program: Command;
  utils: {
    getOptionsFromCommand: GetOptionsFromCommand;
    resolvePath: ResolvePath;
    envOrDefault: EnvOrDefault;
  };
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
