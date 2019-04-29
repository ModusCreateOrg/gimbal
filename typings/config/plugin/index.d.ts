import { Command } from 'commander';
import { Emitter } from '@/typings/event';
import { GetOptionsFromCommand } from '@/typings/utils/command';

export interface PluginOptions {
  event: Emitter;
  program: Command;
  utils: {
    getOptionsFromCommand: GetOptionsFromCommand;
  };
}

export type PluginFunction = (options: PluginOptions) => void;

export interface Plugin {
  default: PluginFunction;
}
