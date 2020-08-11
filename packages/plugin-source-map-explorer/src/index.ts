import { PluginOptions } from '@/typings/config/plugin';
import { Config } from './config';
import { registerModule } from './mod';

const SourceMapExplorer = async (pluginOptions: PluginOptions, config: Config): Promise<void> =>
  registerModule(pluginOptions, config);

export default SourceMapExplorer;
