import { Options } from 'minimist-options';

import Cli from '../../utils/Cli';

class ArgsContext {
  private readonly $cli: typeof Cli = Cli;

  add(newOptions: Options): this {
    this.$cli.add(newOptions);

    return this;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  get(name?: string): any {
    const { args } = this.$cli;

    if (name) {
      return args[name];
    }

    return args;
  }
}

export default ArgsContext;
