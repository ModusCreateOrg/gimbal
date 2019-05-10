import { TableInstanceOptions } from 'cli-table3';

export interface Column {
  header: string;
  key: string;
  renderer?: Renderer;
}

export interface Config {
  columns?: Column[];
  data?: Data[];
  options?: TableInstanceOptions;
}

export type Finder = (item: Column | Data, index: number) => boolean;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Data = any;
export type Renderer = (value: Data, item: Data) => string;
export type Renders = 'cli' | 'html' | 'markdown';

export interface RendererArgs {
  columns: Column[];
  data: Data[];
  options?: TableInstanceOptions;
}
