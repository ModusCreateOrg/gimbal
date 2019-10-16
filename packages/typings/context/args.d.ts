import { Options } from 'minimist-options';

export interface ArgsContext {
  add: (newOptions: Options) => this;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  get: (name?: string) => any;
}
