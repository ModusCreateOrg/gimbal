import { resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import deepmerge from 'deepmerge';
import mkdirp from 'mkdirp';
import { dirname } from 'path';
import sqlite3 from 'sqlite3';
import { PluginOptions } from '@/typings/config/plugin';
import { GetEvent, SaveEvent } from '@/typings/plugin/last-value';

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

const sqlite = async ({ context }: PluginOptions, config: Config): Promise<void> => {
  const sqliteConfig = deepmerge(defaultConfig, config || {});

  if (sqliteConfig.file !== ':memory:') {
    const cwd = context.config.get('configs.cwd');

    sqliteConfig.file = resolvePath(cwd, sqliteConfig.file);
  }

  if (willNeedDatabase(sqliteConfig)) {
    if (sqliteConfig.file !== ':memory:') {
      await mkdirp(dirname(sqliteConfig.file));
    }

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

      await init(pluginConfig, context);

      context.event.on(
        'plugin/last-value/report/get',
        (_eventName: string, { command }: GetEvent): Promise<void> => getLastReport(command, pluginConfig, context),
      );

      context.event.on(
        'plugin/last-value/report/save',
        (_eventName: string, { command, report }: SaveEvent): Promise<void> =>
          saveLastReport(command, report, pluginConfig, context),
      );
    }
  }
};

export default sqlite;
