import bundlesizeModule from '@/module/bundlesize';
import { ParsedBundleConfig } from '@/typings/module/bundlesize';
import { CommandOptions } from '@/typings/utils/command';

const bundlesizeCommand = async (options: CommandOptions): Promise<ParsedBundleConfig[]> =>
  // TODO make configurable
  bundlesizeModule(options.cwd as string);

export default bundlesizeCommand;
