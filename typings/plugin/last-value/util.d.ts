import { Meta } from '@/typings/module';

export interface DiffRet {
  change: number;
  diff: number;
}

export interface Metas {
  [label: string]: Meta;
}
