import bundlesizeModule from '@/module/bundlesize';
import { BundleConfig, ParsedBundleConfig } from '@/typings/module/bundlesize';
import { CommandOptions } from '@/typings/utils/command';

const defaultConfig: BundleConfig = {
  configs: [
    {
      path: './build/precache-*.js',
      maxSize: '50 KB',
    },
    {
      path: './build/static/js/*.chunk.js',
      maxSize: '200 KB',
    },
    {
      path: './build/static/js/runtime*.js',
      maxSize: '30 KB',
    },
  ],
};

const bundlesizeCommand = async (options: CommandOptions): Promise<ParsedBundleConfig[]> =>
  // TODO make configurable
  bundlesizeModule(options.cwd as string, defaultConfig);

export default bundlesizeCommand;
