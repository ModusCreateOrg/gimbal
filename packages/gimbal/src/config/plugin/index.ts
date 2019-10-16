import deepmerge from 'deepmerge';
import resolver from '@/config/resolver';
import EventEmitter from '@/event';
import { PluginConfig, Plugin, PluginOptions } from '@/typings/config/plugin';
import { LoadEndEvent } from '@/typings/config';
import { Context } from '@/typings/context';

interface Map {
  [label: string]: PluginConfig;
}

// this is the object that gets passed to a plugin function
const options: Pick<PluginOptions, 'dir'> = {
  dir: __dirname,
};

const map: Map = {};

const parsePlugins = async (
  plugins: (string | PluginConfig)[],
  dir: string,
  context: Context,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
): Promise<any[]> => {
  const pluginConfigs = await Promise.all(
    plugins.map(
      async (plugin: string | PluginConfig): Promise<PluginConfig> => {
        const obj: PluginConfig = typeof plugin === 'string' ? { plugin, name: plugin } : plugin;
        const resolved = await import(resolver(obj.plugin as string, dir, 'plugin'));

        return {
          ...obj,
          plugin: resolved as Plugin,
        };
      },
    ),
  );

  return Promise.all(
    pluginConfigs.map(
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (config: PluginConfig): any => {
        const { plugin, ...pluginConfig } = config;

        if (pluginConfig.enabled === false) {
          // global config to disable plugin
          return undefined;
        }

        const func = (plugin as Plugin).default;

        map[config.name] = config;

        // since we could be in user land, let's clone
        // the options object incase someone messes with
        // it that could cause issues.
        // Also return it in case it's a promise, we can
        // wait for it.
        return func({ ...options, context, dir }, deepmerge(pluginConfig, {}));
      },
    ),
  );
};

EventEmitter.on(
  'config/load/end',
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  async (_eventName: string, { config: { plugins }, context, dir }: LoadEndEvent): Promise<void | any[]> =>
    plugins && plugins.length ? parsePlugins(plugins, dir, context) : undefined,
);

export default parsePlugins;
