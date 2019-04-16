import bundlesizeModule from '@/module/bundle-size';
import { ParsedBundleConfig } from '@/typings/module/bundle-size';
import { CommandOptions } from '@/typings/utils/command';

const bundlesizeCommand = (options: CommandOptions): Promise<ParsedBundleConfig[]> =>
  // TODO make configurable
  bundlesizeModule(options.cwd as string);

export default bundlesizeCommand;
