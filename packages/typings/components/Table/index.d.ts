import { TableInstanceOptions } from 'cli-table3';

export type Alignments = 'left' | 'center' | 'right';

export interface Column {
  align?: Alignments;
  header: string;
  key: string;
  maxWidth?: number;
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
export type Renderer = (value: Data, item: Data) => string | Promise<string>;
export type Renders = 'cli' | 'html' | 'markdown';

export interface RendererArgs {
  columns: Column[];
  data: Data[];
  options?: TableInstanceOptions;
}

export interface Table {
  add: (item: Data, index?: number) => void;
  addColumn: (column: Column, index?: number) => void;
  find: (callback: Finder, getIndex: boolean) => Data | number | void;
  findColumn: (callback: Finder, getIndex: boolean) => Column | number | void;
  get: (index: number) => Data | void;
  getColumn: (index: number) => Column | void;
  remove: (item: Data) => void;
  removeColumn: (column: Column) => void;
  render: (type: Renders) => Promise<string>;
  set: (data: Data[]) => void;
}
