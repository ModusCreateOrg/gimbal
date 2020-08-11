import deepmerge from 'deepmerge';
import { PluginOptions } from '@/typings/config/plugin';
import { Config } from './config';
import { registerModule } from './mod';

const SourceMapExplorer = async (pluginOptions: PluginOptions, config: Config): Promise<void> => {
  const pluginConfig: Config = deepmerge({}, config);

  registerModule(pluginOptions, pluginConfig);
};

export default SourceMapExplorer;
