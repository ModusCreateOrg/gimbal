import program from 'commander';
import resolver from '@/config/resolver';
import event from '@/event';
import { Plugin, PluginFunction, PluginOptions } from '@/typings/config/plugin';
import { getOptionsFromCommand } from '@/utils/command';

// this is the object that gets passed to a plugin function
const options: PluginOptions = {
  event,
  program,
  utils: {
    getOptionsFromCommand,
  },
};

const parsePlugins = async (plugins: (string | Plugin | PluginFunction)[], dir: string): Promise<void> => {
  const pluginFunctions = await Promise.all(
    plugins.map(
      (plugin: string | Plugin | PluginFunction): Promise<Plugin | PluginFunction> => {
        if (typeof plugin === 'string') {
          return import(resolver(plugin, dir));
        }

        return Promise.resolve(plugin as Plugin | PluginFunction);
      },
    ),
  );

  pluginFunctions.forEach(
    (plugin: Plugin | PluginFunction): void => {
      const func = (plugin as Plugin).default
        ? ((plugin as Plugin).default as PluginFunction)
        : (plugin as PluginFunction);

      // since we could be in user land, let's clone
      // the options object incase someone messes with
      // it that could cause issues.
      func({ ...options });
    },
  );
};

export default parsePlugins;
