import { Command } from 'commander';
import { Emitter } from '@/typings/event';
import { Get, Register } from '@/typings/module/registry';
import { Metas } from '@/typings/plugin/last-value/util';
import { ResolvePath } from '@/typings/utils/fs';
import { CommandOptions, GetOptionsFromCommand } from '@/typings/utils/command';
import { EnvOrDefault } from '@/typings/utils/env';

export interface PluginOptions {
  commandOptions?: CommandOptions;
  dir: string;
  event: Emitter;
  modules: {
    get: Get;
    metas: Metas;
    register: Register;
  };
  program: Command;
  utils: {
    getOptionsFromCommand: GetOptionsFromCommand;
    resolvePath: ResolvePath;
    envOrDefault: EnvOrDefault;
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
