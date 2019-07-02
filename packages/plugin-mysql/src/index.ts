import envOrDefault from '@modus/gimbal-core/lib/utils/env';
import deepmerge from 'deepmerge';
import mysqlMod, { Connection, MysqlError } from 'mysql';
import { PluginOptions } from '@/typings/config/plugin';
import { GetEvent, SaveEvent } from '@/typings/plugin/last-value';
import { EnvOrDefault } from '@/typings/utils/env';

interface ItemConfig {
  database: string;
  table: string;
}

type Item = boolean | ItemConfig;

interface Config {
  lastValue: Item;
}

const defaultConfig: Config = {
  lastValue: false,
};

const createConnection = (config: ItemConfig, env: EnvOrDefault): Promise<Connection> =>
  new Promise((resolve, reject): void => {
    const connection = mysqlMod.createConnection({
      host: env('GIMBAL_MYSQL_HOST', 'localhost'),
      user: env('GIMBAL_MYSQL_USERNAME', 'root'),
      password: env('GIMBAL_MYSQL_PASSWORD'),
      database: config.database,
    });

    connection.connect((error: MysqlError | null): void => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });

const mysql = async ({ bus }: PluginOptions, config: Config): Promise<void> => {
  const mysqlConfig = deepmerge(defaultConfig, config);

  if (mysqlConfig.lastValue) {
    const { getLastReport, init, saveLastReport } = await import('./last-value');
    const event = await bus('event');
    const itemConfig: ItemConfig = deepmerge(
      {
        ...mysqlConfig,
        database: 'gimbal',
        table: 'gimbal_archive',
      },
      mysqlConfig.lastValue === true ? {} : mysqlConfig.lastValue,
    );

    const connection = await createConnection(itemConfig, envOrDefault);

    await init(connection, itemConfig);

    event.on(
      'plugin/last-value/report/get',
      (_eventName: string, { command }: GetEvent): Promise<void> => getLastReport(command, connection, itemConfig),
    );

    event.on(
      'plugin/last-value/report/save',
      (_eventName: string, { command, report }: SaveEvent): Promise<void> =>
        saveLastReport(command, report, connection, itemConfig),
    );
  }
};

export default mysql;
