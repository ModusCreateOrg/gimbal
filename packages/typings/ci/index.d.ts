export interface Cls {
  is: () => boolean;
  name: string;
}

export type CIMode = 'commit' | 'pr';
