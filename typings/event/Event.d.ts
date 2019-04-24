import { Data } from '@/typings/utils/Queue';

export type Callback = (data: Data) => Data | void;
export interface Config {
  fn: Callback;
  priority?: number;
}
