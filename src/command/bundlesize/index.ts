import bundlesizeModule from '@/module/bundlesize';
import { BundleConfig, ParsedBundleConfig } from '@/typings/module/bundlesize';
import { CommandOptions } from '@/typings/utils/command';

const defaultConfig: BundleConfig = {
  configs: [
    {
      path: './build/precache-*.js',
      maxSize: '50 kB',
    },
    {
      path: './build/static/js/*.chunk.js',
      maxSize: '300 kB',
    },
    {
      path: './build/static/js/runtime*.js',
      maxSize: '30 kB',
    },
  ],
};

const bundlesizeCommand = async (options: CommandOptions): Promise<void> => {
  // TODO make configurable
  const failed: ParsedBundleConfig[] = await bundlesizeModule(options.cwd as string, defaultConfig);

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(failed, null, 2));
};

export default bundlesizeCommand;
