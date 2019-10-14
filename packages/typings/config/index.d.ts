// @ts-ignore
import lighthouse from 'lighthouse';
import { ParsedArgs } from 'minimist';
import { Plugin } from '@/typings/config/plugin';
import { Modules } from '@/typings/module';
import { Config as HeapSnapshotConfig } from '@/typings/module/heap-snapshot';
import { SizeConfigs } from '@/typings/module/size';
import { UnusedSourceConfig } from '@/typings/module/unused-source';

export type PluginType = string | Plugin;

export interface Configs {
  'heap-snapshot'?: HeapSnapshotConfig;
  lighthouse?: lighthouse.Config.Json;
  size?: SizeConfigs[];
  'unused-source'?: UnusedSourceConfig;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [name: string]: any;
}

export interface Outputs {
  html?: string;
  json?: string;
  markdown?: string;
}

export interface Config {
  audits?: Modules[];
  configs?: Configs;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  jobs?: any; // still have to decide what this will look like fully
  outputs?: Outputs;
  plugins?: string[];
}

export type LoaderFn = (file: string) => Promise<Config>;

export interface LoaderMap {
  js: LoaderFn;
  json: LoaderFn;
  yaml: LoaderFn;
  yml: LoaderFn;
  [name: string]: LoaderFn;
}

export interface LoadStartEvent {
  args: ParsedArgs;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Config: any; // would cause circular dependency if imported the command class
  dir: string;
  file: string;
  force: boolean;
}

export interface LoadEndEvent extends LoadStartEvent {
  config: Config;
}
