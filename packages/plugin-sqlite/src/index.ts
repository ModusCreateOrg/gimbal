import { resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import deepmerge from 'deepmerge';
import mkdirpMod from 'mkdirp';
import { dirname } from 'path';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { PluginOptions } from '@/typings/config/plugin';
import { GetEvent, SaveEvent } from '@/typings/plugin/last-value';

const mkdirp = promisify(mkdirpMod);

interface ItemConfig {
  table: string;
}

type Item = boolean | ItemConfig;

interface Config {
  commandPrefix?: string | string[];
  file?: string;
  lastValue?: Item;
}

const defaultConfig: Config = {
  file: 'gimbal.db',
  lastValue: false,
};

const willNeedDatabase = (config: Config): boolean => config.lastValue !== false;

const sqlite = async ({ bus, commandOptions }: PluginOptions, config: Config): Promise<void> => {
  const sqliteConfig = deepmerge(defaultConfig, config);

  if (commandOptions && sqliteConfig.file !== ':memory:') {
    sqliteConfig.file = resolvePath(commandOptions.cwd, sqliteConfig.file);
  }

  if (willNeedDatabase(sqliteConfig)) {
    if (sqliteConfig.file !== ':memory:') {
      await mkdirp(dirname(sqliteConfig.file));
    }

    const event = await bus('event');
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
        (_eventName: string, { command }: GetEvent): Promise<void> => getLastReport(command, pluginConfig),
      );

      event.on(
        'plugin/last-value/report/save',
        (_eventName: string, { command, report }: SaveEvent): Promise<void> =>
          saveLastReport(command, report, pluginConfig),
      );
    }
  }
};

export default sqlite;
