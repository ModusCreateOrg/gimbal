import { Options } from 'minimist-options';

export interface ArgsContext {
  add: (newOptions: Options) => this;
  get: (name: string) => any;
}
