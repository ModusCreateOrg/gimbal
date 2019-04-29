import { Data } from '@/typings/utils/Queue';

export type Callback = (event: string, data: Data) => Data | void;
export interface Config {
  fn: Callback;
  priority?: number;
}
