import { Connection, MysqlError } from 'mysql';
import { Report } from '@/typings/command';

interface Config {
  database: string;
  table: string;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Row = any;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const query = (connection: Connection, sql: string, params?: any): Promise<any> =>
  new Promise(
    (resolve, reject): void => {
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
    },
  );

export const init = async (connection: Connection, config: Config): Promise<void> =>
  query(
    connection,
    `CREATE TABLE IF NOT EXISTS ${
      config.table
    } (command VARCHAR(255) NOT NULL, date DATETIME NOT NULL, report LONGTEXT NOT NULL) ENGINE=INNODB;`,
  );

export const getLastReport = async (command: string, connection: Connection, config: Config): Promise<void> =>
  query(connection, `SELECT command, date, report FROM ${config.table} WHERE command = ? ORDER BY date DESC LIMIT 1;`, [
    command,
  ]).then((rows: Row[]): Row => rows[0]);

export const saveLastReport = async (
  command: string,
  report: Report,
  connection: Connection,
  config: Config,
): Promise<void> =>
  query(connection, `INSERT INTO ${config.table} VALUES (?, NOW(), ?);`, [command, JSON.stringify(report)]);
