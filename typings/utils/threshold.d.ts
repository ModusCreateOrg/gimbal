export interface LighthouseThreshold {
  accessibility?: number;
  'best-practices'?: number;
  performance?: number;
  pwa?: number;
  seo?: number;
}

export interface AdvancedThreshold extends LighthouseThreshold {
  // heap-snapshot module
  Documents?: number;
  Frames?: number;
  JSHeapTotalSize?: number;
  JSHeapUsedSize?: number;
  LayoutCount?: number;
  Nodes?: number;
  RecalcStyleDuration?: number;

  [name: string]: number | void;
}

export type Threshold = number | AdvancedThreshold;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Parser = (obj: any) => number;

export type Modes = 'above' | 'below';

export interface Options {
  mode?: Modes;
  parser?: Parser;
}
