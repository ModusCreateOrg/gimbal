import program from 'commander';
import resolver from '@/config/resolver';
import event from '@/event';
import { PluginConfig, Plugin, PluginFunction, PluginOptions } from '@/typings/config/plugin';
import { CommandOptions } from '@/typings/utils/command';
import { getOptionsFromCommand } from '@/utils/command';

// this is the object that gets passed to a plugin function
const options: PluginOptions = {
  event,
  program,
  utils: {
    getOptionsFromCommand,
  },
};

const parsePlugins = async (
  plugins: (string | Plugin | PluginFunction)[],
  dir: string,
  commandOptions: CommandOptions,
): Promise<void[]> => {
  const pluginConfigs = await Promise.all(
    plugins.map(
      async (plugin: string | PluginConfig | Plugin | PluginFunction): Promise<PluginConfig> => {
        if (typeof plugin === 'function' || (plugin as Plugin).default) {
          return {
            plugin: plugin as Plugin,
          };
        }

        const obj: PluginConfig = typeof plugin === 'string' ? { plugin } : (plugin as PluginConfig);
        const resolved = await import(resolver(obj.plugin as string, dir));

        return {
          ...obj,
          plugin: resolved as Plugin,
        };
      },
    ),
  );

  return Promise.all(
    pluginConfigs.map(
      (config: PluginConfig): void => {
        const { plugin } = config;
        const func = (plugin as Plugin).default
          ? ((plugin as Plugin).default as PluginFunction)
          : (plugin as PluginFunction);

        // since we could be in user land, let's clone
        // the options object incase someone messes with
        // it that could cause issues.
        // Also return it in case it's a promise, we can
        // wait for it.
        return func({ ...options, commandOptions: { ...commandOptions }, utils: { ...options.utils } }, config);
      },
    ),
  );
};

export default parsePlugins;
