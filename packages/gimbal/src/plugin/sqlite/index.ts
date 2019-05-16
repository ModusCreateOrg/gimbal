import deepmerge from 'deepmerge';
import sqlite3 from 'sqlite3';
import { PluginOptions } from '@/typings/config/plugin';
import { resolvePath } from '@/utils/fs';

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

const sqlite = async ({ commandOptions, event }: PluginOptions, config: Config): Promise<void> => {
  const sqliteConfig = deepmerge(defaultConfig, config);

  if (commandOptions) {
    sqliteConfig.file = resolvePath(commandOptions.cwd, sqliteConfig.file);
  }

  if (willNeedDatabase(sqliteConfig)) {
    const db = new sqlite3.Database(sqliteConfig.file);

    if (config.lastValue) {
      const { getLastReport, saveLastReport } = await import('./last-value');
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

      db.run(`CREATE TABLE IF NOT EXISTS ${pluginConfig.table} (command TEXT, date INTEGER, report BLOB);`);

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
