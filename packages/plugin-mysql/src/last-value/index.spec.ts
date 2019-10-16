import mysql from 'mysql';

import { Context } from '@/typings/context';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
jest.mock('mysql', (): any => ({
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  createConnection: (): any => ({}),
}));

beforeEach((): void => {
  jest.resetModules();
  jest.restoreAllMocks();
});

const mockOptions = {
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'my-db',
};

describe('@modus/gimbal-plugin-mysql/last-value', (): void => {
  describe('init', (): void => {
    it('should run create table query', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const connection = mysql.createConnection(mockOptions);
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const query = jest.fn().mockImplementation((_sql: string, _params: any, callback): any => callback(null, 'good'));

      connection.query = query;

      const { init } = await import('./index');

      const ret = await init(
        connection,
        {
          database: 'my-db',
          table: 'my-table',
        },
        context,
      );

      expect(ret).toBe('good');

      expect(query).toHaveBeenCalledWith(
        `CREATE TABLE IF NOT EXISTS my-table (
      id INT NOT NULL AUTO_INCREMENT,
      command VARCHAR(255) NOT NULL,
      date DATETIME NOT NULL,
      report LONGTEXT NOT NULL,
      PRIMARY KEY (id, command),
      UNIQUE INDEX id_UNIQUE (id ASC)) ENGINE=INNODB;`,
        undefined,
        expect.any(Function),
      );

      expect(verbose).toHaveBeenCalledTimes(2);
      expect(verbose).toHaveBeenNthCalledWith(1, '[@modus/gimbal-plugin-mysql]', 'Creating table...');
      expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Table created!');
    });

    it('should run create table query and handle an error', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const connection = mysql.createConnection(mockOptions);
      const query = jest
        .fn()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .mockImplementation((_sql: string, _params: any, callback): any => callback(new Error('foobar')));

      connection.query = query;

      const { init } = await import('./index');

      const check = init(
        connection,
        {
          database: 'my-db',
          table: 'my-table',
        },
        context,
      );

      await expect(check).rejects.toThrow(new Error('foobar'));

      expect(query).toHaveBeenCalledWith(
        `CREATE TABLE IF NOT EXISTS my-table (
      id INT NOT NULL AUTO_INCREMENT,
      command VARCHAR(255) NOT NULL,
      date DATETIME NOT NULL,
      report LONGTEXT NOT NULL,
      PRIMARY KEY (id, command),
      UNIQUE INDEX id_UNIQUE (id ASC)) ENGINE=INNODB;`,
        undefined,
        expect.any(Function),
      );

      expect(verbose).toHaveBeenCalledTimes(1);
      expect(verbose).toHaveBeenNthCalledWith(1, '[@modus/gimbal-plugin-mysql]', 'Creating table...');
    });

    it('should handle no connection', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const { init } = await import('./index');

      const ret = await init(
        undefined,
        {
          database: 'my-db',
          table: 'my-table',
        },
        context,
      );

      expect(ret).toBeUndefined();

      expect(verbose).toHaveBeenCalledTimes(2);
      expect(verbose).toHaveBeenNthCalledWith(1, '[@modus/gimbal-plugin-mysql]', 'Creating table...');
      expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Table created!');
    });
  });

  describe('getLastReport', (): void => {
    it('should run select query', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const connection = mysql.createConnection(mockOptions);
      const query = jest
        .fn()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .mockImplementation((_sql: string, _params: any, callback): any => callback(null, ['good']));

      connection.query = query;

      const { getLastReport } = await import('./index');

      const ret = await getLastReport(
        'foo-command',
        connection,
        {
          database: 'my-db',
          table: 'my-table',
        },
        context,
      );

      expect(ret).toBe('good');

      expect(query).toHaveBeenCalledWith(
        'SELECT command, date, report FROM my-table WHERE command = ? ORDER BY date DESC LIMIT 1;',
        ['foo-command'],
        expect.any(Function),
      );

      expect(verbose).toHaveBeenCalledTimes(2);
      expect(verbose).toHaveBeenNthCalledWith(
        1,
        '[@modus/gimbal-plugin-mysql]',
        'Getting last report for "foo-command" command...',
      );
      expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Got last report!');
    });

    it('should run select table query and handle an error', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const connection = mysql.createConnection(mockOptions);
      const query = jest
        .fn()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .mockImplementation((_sql: string, _params: any, callback): any => callback(new Error('foobar')));

      connection.query = query;

      const { getLastReport } = await import('./index');

      const check = getLastReport(
        'foo-command',
        connection,
        {
          database: 'my-db',
          table: 'my-table',
        },
        context,
      );

      await expect(check).rejects.toThrow(new Error('foobar'));

      expect(query).toHaveBeenCalledWith(
        'SELECT command, date, report FROM my-table WHERE command = ? ORDER BY date DESC LIMIT 1;',
        ['foo-command'],
        expect.any(Function),
      );

      expect(verbose).toHaveBeenCalledTimes(1);
      expect(verbose).toHaveBeenNthCalledWith(
        1,
        '[@modus/gimbal-plugin-mysql]',
        'Getting last report for "foo-command" command...',
      );
    });

    it('should run select query with no return', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const connection = mysql.createConnection(mockOptions);
      const query = jest
        .fn()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .mockImplementation((_sql: string, _params: any, callback): any => callback(null, undefined));

      connection.query = query;

      const { getLastReport } = await import('./index');

      const ret = await getLastReport(
        'foo-command',
        connection,
        {
          database: 'my-db',
          table: 'my-table',
        },
        context,
      );

      expect(ret).toBeUndefined();

      expect(query).toHaveBeenCalledWith(
        'SELECT command, date, report FROM my-table WHERE command = ? ORDER BY date DESC LIMIT 1;',
        ['foo-command'],
        expect.any(Function),
      );

      expect(verbose).toHaveBeenCalledTimes(2);
      expect(verbose).toHaveBeenNthCalledWith(
        1,
        '[@modus/gimbal-plugin-mysql]',
        'Getting last report for "foo-command" command...',
      );
      expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Did not find a last report.');
    });

    describe('commandPrefix', (): void => {
      it('should allow for commandPrefix as a string', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, [{ command: 'master-foo-command' }]),
          );

        connection.query = query;

        const { getLastReport } = await import('./index');

        const ret = await getLastReport(
          'foo-command',
          connection,
          {
            commandPrefix: 'master',
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'foo-command' });

        expect(query).toHaveBeenCalledWith(
          'SELECT command, date, report FROM my-table WHERE command = ? ORDER BY date DESC LIMIT 1;',
          ['master-foo-command'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Getting last report for "master-foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Got last report!');
      });

      it('should allow for commandPrefix to be an array of strings', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, [{ command: 'master-foo-command' }]),
          );

        connection.query = query;

        const { getLastReport } = await import('./index');

        const ret = await getLastReport(
          'foo-command',
          connection,
          {
            commandPrefix: ['master'],
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'foo-command' });

        expect(query).toHaveBeenCalledWith(
          'SELECT command, date, report FROM my-table WHERE command = ? ORDER BY date DESC LIMIT 1;',
          ['master-foo-command'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Getting last report for "master-foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Got last report!');
      });

      it('should handle if a variable was not replaced', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, [{ command: 'master-foo-command' }]),
          );

        connection.query = query;

        const { getLastReport } = await import('./index');

        const ret = await getLastReport(
          'foo-command',
          connection,
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: ['${env:FOO}', 'master'],
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'foo-command' });

        expect(query).toHaveBeenCalledWith(
          'SELECT command, date, report FROM my-table WHERE command = ? ORDER BY date DESC LIMIT 1;',
          ['master-foo-command'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Getting last report for "master-foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Got last report!');
      });

      it('should handle if a variable was not replaced with true/false values', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, [{ command: 'master-foo-command' }]),
          );

        connection.query = query;

        const { getLastReport } = await import('./index');

        const ret = await getLastReport(
          'foo-command',
          connection,
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: ['${env:FOO}', '${env:FOO, true, false}', 'master'],
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'foo-command' });

        expect(query).toHaveBeenCalledWith(
          'SELECT command, date, report FROM my-table WHERE command = ? ORDER BY date DESC LIMIT 1;',
          ['master-foo-command'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Getting last report for "master-foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Got last report!');
      });
    });
  });

  describe('saveLastReport', (): void => {
    it('should run insert query', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const connection = mysql.createConnection(mockOptions);
      const query = jest
        .fn()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .mockImplementation((_sql: string, _params: any, callback): any => callback(null, 'good'));

      connection.query = query;

      const { saveLastReport } = await import('./index');

      const ret = await saveLastReport(
        'foo-command',
        { success: true },
        connection,
        {
          database: 'my-db',
          table: 'my-table',
        },
        context,
      );

      expect(ret).toBe('good');

      expect(query).toHaveBeenCalledWith(
        'INSERT INTO my-table (command, date, report) VALUES (?, NOW(), ?);',
        ['foo-command', '{"success":true}'],
        expect.any(Function),
      );

      expect(verbose).toHaveBeenCalledTimes(2);
      expect(verbose).toHaveBeenNthCalledWith(
        1,
        '[@modus/gimbal-plugin-mysql]',
        'Saving new report for "foo-command" command...',
      );
      expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Saved new report!');
    });

    it('should run insert table query and handle an error', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;
      const connection = mysql.createConnection(mockOptions);
      const query = jest
        .fn()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .mockImplementation((_sql: string, _params: any, callback): any => callback(new Error('foobar')));

      connection.query = query;

      const { saveLastReport } = await import('./index');

      const check = saveLastReport(
        'foo-command',
        { success: true },
        connection,
        {
          database: 'my-db',
          table: 'my-table',
        },
        context,
      );

      await expect(check).rejects.toThrow(new Error('foobar'));

      expect(query).toHaveBeenCalledWith(
        'INSERT INTO my-table (command, date, report) VALUES (?, NOW(), ?);',
        ['foo-command', '{"success":true}'],
        expect.any(Function),
      );

      expect(verbose).toHaveBeenCalledTimes(1);
      expect(verbose).toHaveBeenNthCalledWith(
        1,
        '[@modus/gimbal-plugin-mysql]',
        'Saving new report for "foo-command" command...',
      );
    });

    describe('commandPrefix', (): void => {
      it('should allow for commandPrefix as a string', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, { command: 'master-foo-command' }),
          );

        connection.query = query;

        const { saveLastReport } = await import('./index');

        const ret = await saveLastReport(
          'foo-command',
          { success: true },
          connection,
          {
            commandPrefix: 'master',
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'master-foo-command' });

        expect(query).toHaveBeenCalledWith(
          'INSERT INTO my-table (command, date, report) VALUES (?, NOW(), ?);',
          ['master-foo-command', '{"success":true}'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Saving new report for "master-foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Saved new report!');
      });

      it('should not allow for commandPrefix as a string if not replaced', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, { command: 'foo-command' }),
          );

        connection.query = query;

        const { saveLastReport } = await import('./index');

        const ret = await saveLastReport(
          'foo-command',
          { success: true },
          connection,
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: '${env:FOO}',
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'foo-command' });

        expect(query).toHaveBeenCalledWith(
          'INSERT INTO my-table (command, date, report) VALUES (?, NOW(), ?);',
          ['foo-command', '{"success":true}'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Saving new report for "foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Saved new report!');
      });

      it('should allow for commandPrefix to be an array of strings', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, { command: 'master-foo-command' }),
          );

        connection.query = query;

        const { saveLastReport } = await import('./index');

        const ret = await saveLastReport(
          'foo-command',
          { success: true },
          connection,
          {
            commandPrefix: ['master'],
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'master-foo-command' });

        expect(query).toHaveBeenCalledWith(
          'INSERT INTO my-table (command, date, report) VALUES (?, NOW(), ?);',
          ['master-foo-command', '{"success":true}'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Saving new report for "master-foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Saved new report!');
      });

      it('should handle if a variable was not replaced', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, { command: 'master-foo-command' }),
          );

        connection.query = query;

        const { saveLastReport } = await import('./index');

        const ret = await saveLastReport(
          'foo-command',
          { success: true },
          connection,
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: ['${env:FOO}', 'master'],
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'master-foo-command' });

        expect(query).toHaveBeenCalledWith(
          'INSERT INTO my-table (command, date, report) VALUES (?, NOW(), ?);',
          ['master-foo-command', '{"success":true}'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Saving new report for "master-foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Saved new report!');
      });

      it('should handle if a variable was not replaced with true/false values', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const connection = mysql.createConnection(mockOptions);
        const query = jest
          .fn()
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .mockImplementation((_sql: string, _params: any, callback): any =>
            callback(null, { command: 'master-foo-command' }),
          );

        connection.query = query;

        const { saveLastReport } = await import('./index');

        const ret = await saveLastReport(
          'foo-command',
          { success: true },
          connection,
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: ['${env:FOO}', '${env:FOO, true, false}', 'master'],
            database: 'my-db',
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'master-foo-command' });

        expect(query).toHaveBeenCalledWith(
          'INSERT INTO my-table (command, date, report) VALUES (?, NOW(), ?);',
          ['master-foo-command', '{"success":true}'],
          expect.any(Function),
        );

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-mysql]',
          'Saving new report for "master-foo-command" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-mysql]', 'Saved new report!');
      });
    });
  });
});
