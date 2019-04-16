// @ts-ignore
import lighthouse from 'lighthouse';
import { BundleConfigs } from '@/typings/module/bundle-size';

export interface Configs {
  'bundle-size': BundleConfigs[];
  lighthouse: lighthouse.Config.Json;
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
}

export type LoaderFn = (file: string) => Promise<Config>;

export interface LoaderMap {
  js: LoaderFn;
  json: LoaderFn;
  yaml: LoaderFn;
  yml: LoaderFn;
  [name: string]: LoaderFn;
}
