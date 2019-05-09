import { Command } from 'commander';
import { Emitter } from '@/typings/event';
import { CommandOptions, GetOptionsFromCommand } from '@/typings/utils/command';

export interface PluginOptions {
  commandOptions?: CommandOptions;
  event: Emitter;
  program: Command;
  utils: {
    getOptionsFromCommand: GetOptionsFromCommand;
  };
}

export type PluginFunction = (options: PluginOptions, config: PluginConfig) => void;

export interface Plugin {
  default: PluginFunction;
}

export interface PluginConfig {
  plugin: string | Plugin | PluginFunction;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
}
