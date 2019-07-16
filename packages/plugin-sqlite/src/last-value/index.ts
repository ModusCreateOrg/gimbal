import { Database } from 'sqlite3';
import { Report } from '@/typings/command';

interface Config {
  commandPrefix?: string | string[];
  db?: Database;
  strict?: boolean;
  table: string;
}

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

export const init = async (config: Config): Promise<void> =>
  new Promise((resolve, reject): void => {
    if (!config.db) {
      reject(new Error('no database connected'));
      return;
    }

    /* eslint-disable-next-line no-console */
    console.log('[@modus/gimbal-plugin-sqlite]', 'Creating table...');

    const stmt = config.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${config.table} (command TEXT, date INTEGER, report BLOB);`,
    );

    stmt.run();

    stmt.finalize((): void => {
      /* eslint-disable-next-line no-console */
      console.log('[@modus/gimbal-plugin-sqlite]', 'Table created!');

      resolve();
    });
  });

export const getLastReport = async (command: string, config: Config): Promise<void> =>
  new Promise((resolve, reject): void => {
    if (!config.db) {
      reject(new Error('no database connected'));
      return;
    }

    const parsedCommand = parseCommand(command, config);

    /* eslint-disable-next-line no-console */
    console.log('[@modus/gimbal-plugin-sqlite]', `Getting last report for "${parsedCommand}" command...`);

    const stmt = config.db.prepare(
      `SELECT command, date, report FROM ${config.table} WHERE command = ? ORDER BY date DESC;`,
    );

    stmt.get(
      parsedCommand,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (error: Error | void, row?: any): void => {
        if (error) {
          reject(error);
        } else {
          if (row) {
            /* eslint-disable-next-line no-console */
            console.log('[@modus/gimbal-plugin-sqlite]', 'Got last report!');

            if (config.commandPrefix) {
              /* eslint-disable-next-line no-param-reassign */
              row.command = row.command.replace(parsedCommand, command);
            }
          } else {
            /* eslint-disable-next-line no-console */
            console.log('[@modus/gimbal-plugin-sqlite]', 'Did not find a last report.');
          }

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

    const parsedCommand = parseCommand(command, config);

    /* eslint-disable-next-line no-console */
    console.log('[@modus/gimbal-plugin-mysql]', `Saving new report for "${parsedCommand}" command...`);

    const now = new Date();
    const stmt = config.db.prepare(`INSERT INTO ${config.table} VALUES (?, ?, ?);`);

    stmt.run(parsedCommand, now.getTime(), JSON.stringify(report));

    stmt.finalize((): void => {
      /* eslint-disable-next-line no-console */
      console.log('[@modus/gimbal-plugin-mysql]', 'Saved new report!');

      resolve();
    });
  });
