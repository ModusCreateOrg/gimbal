import deepmerge from 'deepmerge';
import mkdirpMod from 'mkdirp';
import { dirname } from 'path';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { PluginOptions } from '@/typings/config/plugin';

const mkdirp = promisify(mkdirpMod);

interface ItemConfig {
  table: string;
}

type Item = boolean | ItemConfig;

interface Config {
  file: string;
  lastValue: Item;
}

const defaultConfig: Config = {
  file: 'gimbal.db',
  lastValue: false,
};

const willNeedDatabase = (config: Config): boolean => config.lastValue !== false;

const sqlite = async (
  { commandOptions, event, utils: { resolvePath } }: PluginOptions,
  config: Config,
): Promise<void> => {
  const sqliteConfig = deepmerge(defaultConfig, config);

  if (commandOptions) {
    sqliteConfig.file = resolvePath(commandOptions.cwd, sqliteConfig.file);
  }

  if (willNeedDatabase(sqliteConfig)) {
    await mkdirp(dirname(sqliteConfig.file));

    const db = new sqlite3.Database(sqliteConfig.file);

    if (config.lastValue) {
      const { getLastReport, init, saveLastReport } = await import('./last-value');
      const pluginConfig = {
        ...sqliteConfig,
        ...deepmerge(
          {
            table: 'gimbal_archive',
          },
          config.lastValue === true ? {} : config.lastValue,
        ),
        db,
      };

      await init(pluginConfig);

      event.on(
        'plugin/last-value/report/get',
        (eventName, { command }): Promise<void> => getLastReport(command, pluginConfig),
      );

      event.on(
        'plugin/last-value/report/save',
        (eventName, { command, report }): Promise<void> => saveLastReport(command, report, pluginConfig),
      );
    }
  }
};

export default sqlite;
