import { Command } from 'commander';
import { Emitter } from '@/typings/event';
import { CommandOptions, GetOptionsFromCommand } from '@/typings/utils/command';

export interface PluginOptions {
  commandOptions?: CommandOptions;
  dir: string;
  event: Emitter;
  program: Command;
  utils: {
    getOptionsFromCommand: GetOptionsFromCommand;
  };
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type PluginFunction = (options: PluginOptions, config: PluginConfig) => any;

export interface Plugin {
  default: PluginFunction;
}

export interface PluginConfig {
  plugin: string | Plugin;
  name: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
}
