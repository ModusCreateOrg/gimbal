// @ts-ignore
import lighthouse from 'lighthouse';
import { Plugin, PluginFunction } from '@/typings/config/plugin';
import { Config as HeapSnapshotConfig } from '@/typings/module/heap-snapshot';
import { SizeConfigs } from '@/typings/module/size';
import { UnusedSourceConfig } from '@/typings/module/unused-source';

export interface Configs {
  'heap-snapshot': HeapSnapshotConfig;
  lighthouse: lighthouse.Config.Json;
  size: SizeConfigs[];
  'unused-source': UnusedSourceConfig;
}

export interface Outputs {
  html?: string;
  json?: string;
  markdown?: string;
}

export interface Config {
  configs?: Configs;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  jobs?: any; // still have to decide what this will look like fully
  outputs?: Outputs;
  plugins?: (string | Plugin | PluginFunction)[];
}

export type LoaderFn = (file: string) => Promise<Config>;

export interface LoaderMap {
  js: LoaderFn;
  json: LoaderFn;
  yaml: LoaderFn;
  yml: LoaderFn;
  [name: string]: LoaderFn;
}
