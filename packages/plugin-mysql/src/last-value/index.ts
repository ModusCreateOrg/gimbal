import { Connection, MysqlError } from 'mysql';
import { Report } from '@/typings/command';

interface Config {
  commandPrefix?: string | string[];
  database: string;
  table: string;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Row = any;

const VAR_RE = /\${(.+?):(.+?)(?:,\s*(.+?))?(?:,\s*(.+?))?}/;

const getCommandPrefix = (config: Config): string | void => {
  if (config.commandPrefix) {
    if (Array.isArray(config.commandPrefix)) {
      return config.commandPrefix.find((prefix: string): boolean => Boolean(prefix) && !prefix.match(VAR_RE));
    }

    if (!config.commandPrefix.match(VAR_RE)) {
      return config.commandPrefix;
    }
  }

  return undefined;
};

const parseCommand = (command: string, config: Config): string => {
  const prefix = getCommandPrefix(config);

  return prefix ? `${prefix}-${command}` : command;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const query = (connection: Connection | void, sql: string, params?: any): Promise<any> =>
  new Promise((resolve, reject): void => {
    if (connection) {
      connection.query(
        sql,
        params,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (error: MysqlError | null, results: any): any => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        },
      );
    } else {
      resolve();
    }
  });

export const init = async (connection: Connection | void, config: Config): Promise<void> => {
  /* eslint-disable-next-line no-console */
  console.log('[@modus/gimbal-plugin-mysql]', 'Creating table...');

  return query(
    connection,
    `CREATE TABLE IF NOT EXISTS ${config.table} (
      id INT NOT NULL AUTO_INCREMENT,
      command VARCHAR(255) NOT NULL,
      date DATETIME NOT NULL,
      report LONGTEXT NOT NULL,
      PRIMARY KEY (id, command),
      UNIQUE INDEX id_UNIQUE (id ASC)) ENGINE=INNODB;`,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ).then((ret: any): any => {
    /* eslint-disable-next-line no-console */
    console.log('[@modus/gimbal-plugin-mysql]', 'Table created!');

    return ret;
  });
};

export const getLastReport = async (command: string, connection: Connection | void, config: Config): Promise<void> => {
  const parsedCommand = parseCommand(command, config);

  /* eslint-disable-next-line no-console */
  console.log('[@modus/gimbal-plugin-mysql]', `Getting last report for "${parsedCommand}" command...`);

  return query(
    connection,
    `SELECT command, date, report FROM ${config.table} WHERE command = ? ORDER BY date DESC LIMIT 1;`,
    [parsedCommand],
  ).then(
    ([row]: Row[] = []): Row => {
      if (row) {
        /* eslint-disable-next-line no-console */
        console.log('[@modus/gimbal-plugin-mysql]', 'Got last report!');

        if (config.commandPrefix) {
          /* eslint-disable-next-line no-param-reassign */
          row.command = row.command.replace(parsedCommand, command);
        }
      } else {
        /* eslint-disable-next-line no-console */
        console.log('[@modus/gimbal-plugin-mysql]', 'Did not find a last report.');
      }

      return row;
    },
  );
};

export const saveLastReport = async (
  command: string,
  report: Report,
  connection: Connection | void,
  config: Config,
): Promise<void> => {
  const parsedCommand = parseCommand(command, config);

  /* eslint-disable-next-line no-console */
  console.log('[@modus/gimbal-plugin-mysql]', `Saving new report for "${parsedCommand}" command...`);

  return query(connection, `INSERT INTO ${config.table} (command, date, report) VALUES (?, NOW(), ?);`, [
    parsedCommand,
    JSON.stringify(report),
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ]).then((ret: any): any => {
    /* eslint-disable-next-line no-console */
    console.log('[@modus/gimbal-plugin-mysql]', 'Saved new report!');

    return ret;
  });
};
