import { Database } from 'sqlite3';
import { Report } from '@/typings/command';

interface Config {
  db?: Database;
  table: string;
}

export const init = async (config: Config): Promise<void> =>
  new Promise((resolve, reject): void => {
    if (!config.db) {
      reject(new Error('no database connected'));
      return;
    }

    const stmt = config.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${config.table} (command TEXT, date INTEGER, report BLOB);`,
    );

    stmt.run();

    stmt.finalize((): void => resolve());
  });

export const getLastReport = async (command: string, config: Config): Promise<void> =>
  new Promise((resolve, reject): void => {
    if (!config.db) {
      reject(new Error('no database connected'));
      return;
    }

    const stmt = config.db.prepare(
      `SELECT command, date, report FROM ${config.table} WHERE command = ? ORDER BY date DESC;`,
    );

    stmt.get(
      command,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (error: Error | void, row: any): void => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      },
    );

    stmt.finalize();
  });

export const saveLastReport = async (command: string, report: Report, config: Config): Promise<void> =>
  new Promise((resolve, reject): void => {
    if (!config.db) {
      reject(new Error('no database connected'));
      return;
    }

    const now = new Date();
    const stmt = config.db.prepare(`INSERT INTO ${config.table} VALUES (?, ?, ?);`);

    stmt.run(command, now.getTime(), JSON.stringify(report));

    stmt.finalize((): void => resolve());
  });
