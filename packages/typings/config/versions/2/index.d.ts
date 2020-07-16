// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lighthouse from 'lighthouse';
import { Config as HeapSnapshotConfig } from '../../../module/heap-snapshot';
import { SizeConfigs } from '../../../module/size';
import { UnusedSourceConfig } from '../../../module/unused-source';

export interface Audits {
  [name: string]: unknown;
}

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
  audits?: Audits;
  configs?: Configs;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  jobs?: any; // still have to decide what this will look like fully
  outputs?: Outputs;
  plugins?: string[];
  version: number | string;
}
