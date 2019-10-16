import { Database } from 'sqlite3';
import { PluginOptions } from '@/typings/config/plugin';
import { Context } from '@/typings/context';

const contextMock: unknown = {};
const context = contextMock as Context;

const pluginOptions: PluginOptions = {
  context,
  dir: 'foo',
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type SqliteGetCb = (error: Error | void, row?: any) => void;

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-sqlite/last-value', (): void => {
  describe('init', (): void => {
    it('should reject if no database provided', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const { init } = await import('./index');

      const check = init(
        {
          table: 'my-table',
        },
        context,
      );

      await expect(check).rejects.toThrow(new Error('no database connected'));

      expect(verbose).not.toHaveBeenCalled();
    });

    it('should run prepared statement to create table', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const { init } = await import('./index');

      const db = new Database(':memory:');

      const finalize = jest.fn().mockImplementationOnce((cb: () => void): void => cb());
      const run = jest.fn();

      const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

      prepare.mockReturnValueOnce({
        finalize,
        run,
      });

      await init(
        {
          db,
          table: 'my-table',
        },
        context,
      );

      expect(prepare).toHaveBeenCalled();
      expect(run).toHaveBeenCalledWith();
      expect(finalize).toHaveBeenCalled();

      expect(verbose).toHaveBeenCalledTimes(2);
      expect(verbose).toHaveBeenNthCalledWith(1, '[@modus/gimbal-plugin-sqlite]', 'Creating table...');
      expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Table created!');
    });
  });

  describe('getLastReport', (): void => {
    it('should reject if no database provided', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const { getLastReport } = await import('./index');

      const check = getLastReport(
        'did-something',
        {
          table: 'my-table',
        },
        context,
      );

      await expect(check).rejects.toThrow(new Error('no database connected'));

      expect(verbose).not.toHaveBeenCalled();
    });

    it('should handle statement error', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const { getLastReport } = await import('./index');

      const db = new Database(':memory:');

      const finalize = jest.fn();
      const get = jest
        .fn()
        .mockImplementationOnce((_command: string, cb: SqliteGetCb): void => cb(new Error('foobar')));

      const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

      prepare.mockReturnValueOnce({
        finalize,
        get,
      });

      const check = getLastReport(
        'did-something',
        {
          db,
          table: 'my-table',
        },
        context,
      );

      await expect(check).rejects.toThrow(new Error('foobar'));

      expect(prepare).toHaveBeenCalled();
      expect(get).toHaveBeenCalledWith('did-something', expect.any(Function));
      expect(finalize).toHaveBeenCalled();

      expect(verbose).toHaveBeenCalledTimes(1);
      expect(verbose).toHaveBeenNthCalledWith(
        1,
        '[@modus/gimbal-plugin-sqlite]',
        'Getting last report for "did-something" command...',
      );
    });

    it('should resolve with row', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const { getLastReport } = await import('./index');

      const db = new Database(':memory:');

      const finalize = jest.fn();
      const get = jest.fn().mockImplementationOnce((_command: string, cb: SqliteGetCb): void => cb(undefined, 'row'));

      const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

      prepare.mockReturnValueOnce({
        finalize,
        get,
      });

      const ret = await getLastReport(
        'did-something',
        {
          db,
          table: 'my-table',
        },
        context,
      );

      expect(ret).toBe('row');

      expect(prepare).toHaveBeenCalled();
      expect(get).toHaveBeenCalledWith('did-something', expect.any(Function));
      expect(finalize).toHaveBeenCalled();

      expect(verbose).toHaveBeenCalledTimes(2);
      expect(verbose).toHaveBeenNthCalledWith(
        1,
        '[@modus/gimbal-plugin-sqlite]',
        'Getting last report for "did-something" command...',
      );
      expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Got last report!');
    });

    describe('commandPrefix', (): void => {
      it('should allow for a string', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { getLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn();
        const get = jest
          .fn()
          .mockImplementationOnce((_command: string, cb: SqliteGetCb): void =>
            cb(undefined, { command: 'master-did-something' }),
          );

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          get,
        });

        const ret = await getLastReport(
          'did-something',
          {
            commandPrefix: 'master',
            db,
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'did-something' });

        expect(prepare).toHaveBeenCalled();
        expect(get).toHaveBeenCalledWith('master-did-something', expect.any(Function));
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Getting last report for "master-did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Got last report!');
      });

      it('should allow for a string that did not replace variable', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { getLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn();
        const get = jest
          .fn()
          .mockImplementationOnce((_command: string, cb: SqliteGetCb): void =>
            cb(undefined, { command: 'master-did-something' }),
          );

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          get,
        });

        const ret = await getLastReport(
          'did-something',
          {
            /* eslint-disable-next-line no-template-curly-in-string  */
            commandPrefix: '${env:FOO}',
            db,
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'master-did-something' });

        expect(prepare).toHaveBeenCalled();
        expect(get).toHaveBeenCalledWith('did-something', expect.any(Function));
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Getting last report for "did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Got last report!');
      });

      it('should allow for an array of strings', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { getLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn();
        const get = jest
          .fn()
          .mockImplementationOnce((_command: string, cb: SqliteGetCb): void =>
            cb(undefined, { command: 'master-did-something' }),
          );

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          get,
        });

        const ret = await getLastReport(
          'did-something',
          {
            commandPrefix: ['master'],
            db,
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'did-something' });

        expect(prepare).toHaveBeenCalled();
        expect(get).toHaveBeenCalledWith('master-did-something', expect.any(Function));
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Getting last report for "master-did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Got last report!');
      });

      it('should allow for an array of strings with var nonreplacement', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { getLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn();
        const get = jest
          .fn()
          .mockImplementationOnce((_command: string, cb: SqliteGetCb): void =>
            cb(undefined, { command: 'master-did-something' }),
          );

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          get,
        });

        const ret = await getLastReport(
          'did-something',
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: ['${env:FOO}', 'master'],
            db,
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'did-something' });

        expect(prepare).toHaveBeenCalled();
        expect(get).toHaveBeenCalledWith('master-did-something', expect.any(Function));
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Getting last report for "master-did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Got last report!');
      });

      it('should allow for an array of strings with true/false values', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { getLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn();
        const get = jest
          .fn()
          .mockImplementationOnce((_command: string, cb: SqliteGetCb): void =>
            cb(undefined, { command: 'master-did-something' }),
          );

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          get,
        });

        const ret = await getLastReport(
          'did-something',
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: ['${env:FOO}', '${env:FOO, true, false}', 'master'],
            db,
            table: 'my-table',
          },
          context,
        );

        expect(ret).toEqual({ command: 'did-something' });

        expect(prepare).toHaveBeenCalled();
        expect(get).toHaveBeenCalledWith('master-did-something', expect.any(Function));
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Getting last report for "master-did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Got last report!');
      });
    });
  });

  describe('saveLastReport', (): void => {
    it('should reject if no database provided', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const { saveLastReport } = await import('./index');

      const check = saveLastReport(
        'did-something',
        {
          success: true,
        },
        {
          table: 'my-table',
        },
        context,
      );

      await expect(check).rejects.toThrow(new Error('no database connected'));

      expect(verbose).not.toHaveBeenCalled();
    });

    it('should run prepared statement to insert row', async (): Promise<void> => {
      const verbose = jest.fn();

      const contextMock: unknown = {
        logger: {
          verbose,
        },
      };
      const context = contextMock as Context;

      const { saveLastReport } = await import('./index');

      const db = new Database(':memory:');

      const finalize = jest.fn().mockImplementationOnce((cb: () => void): void => cb());
      const run = jest.fn();

      const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

      prepare.mockReturnValueOnce({
        finalize,
        run,
      });

      await saveLastReport(
        'did-something',
        {
          success: true,
        },
        {
          db,
          table: 'my-table',
        },
        context,
      );

      expect(prepare).toHaveBeenCalled();
      expect(run).toHaveBeenCalledWith('did-something', expect.any(Number), '{"success":true}');
      expect(finalize).toHaveBeenCalled();

      expect(verbose).toHaveBeenCalledTimes(2);
      expect(verbose).toHaveBeenNthCalledWith(
        1,
        '[@modus/gimbal-plugin-sqlite]',
        'Saving new report for "did-something" command...',
      );
      expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Saved new report!');
    });

    describe('commandPrefix', (): void => {
      it('should allow for a string', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { saveLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn().mockImplementationOnce((cb: () => void): void => cb());
        const run = jest.fn();

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          run,
        });

        await saveLastReport(
          'did-something',
          {
            success: true,
          },
          {
            commandPrefix: 'master',
            db,
            table: 'my-table',
          },
          context,
        );

        expect(prepare).toHaveBeenCalled();
        expect(run).toHaveBeenCalledWith('master-did-something', expect.any(Number), '{"success":true}');
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Saving new report for "master-did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Saved new report!');
      });

      it('should allow for a string that did not replace variable', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { saveLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn().mockImplementationOnce((cb: () => void): void => cb());
        const run = jest.fn();

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          run,
        });

        await saveLastReport(
          'did-something',
          {
            success: true,
          },
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: '${env:FOO}',
            db,
            table: 'my-table',
          },
          context,
        );

        expect(prepare).toHaveBeenCalled();
        expect(run).toHaveBeenCalledWith('did-something', expect.any(Number), '{"success":true}');
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Saving new report for "did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Saved new report!');
      });

      it('should allow for an array of strings', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { saveLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn().mockImplementationOnce((cb: () => void): void => cb());
        const run = jest.fn();

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          run,
        });

        await saveLastReport(
          'did-something',
          {
            success: true,
          },
          {
            commandPrefix: ['master'],
            db,
            table: 'my-table',
          },
          context,
        );

        expect(prepare).toHaveBeenCalled();
        expect(run).toHaveBeenCalledWith('master-did-something', expect.any(Number), '{"success":true}');
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Saving new report for "master-did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Saved new report!');
      });

      it('should allow for an array of strings with var nonreplacement', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { saveLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn().mockImplementationOnce((cb: () => void): void => cb());
        const run = jest.fn();

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          run,
        });

        await saveLastReport(
          'did-something',
          {
            success: true,
          },
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: ['${env:FOO}', 'master'],
            db,
            table: 'my-table',
          },
          context,
        );

        expect(prepare).toHaveBeenCalled();
        expect(run).toHaveBeenCalledWith('master-did-something', expect.any(Number), '{"success":true}');
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Saving new report for "master-did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Saved new report!');
      });

      it('should allow for an array of strings with true/false values', async (): Promise<void> => {
        const verbose = jest.fn();

        const contextMock: unknown = {
          logger: {
            verbose,
          },
        };
        const context = contextMock as Context;

        const { saveLastReport } = await import('./index');

        const db = new Database(':memory:');

        const finalize = jest.fn().mockImplementationOnce((cb: () => void): void => cb());
        const run = jest.fn();

        const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

        prepare.mockReturnValueOnce({
          finalize,
          run,
        });

        await saveLastReport(
          'did-something',
          {
            success: true,
          },
          {
            /* eslint-disable-next-line no-template-curly-in-string */
            commandPrefix: ['${env:FOO}', '${env:FOO, true, false}', 'master'],
            db,
            table: 'my-table',
          },
          context,
        );

        expect(prepare).toHaveBeenCalled();
        expect(run).toHaveBeenCalledWith('master-did-something', expect.any(Number), '{"success":true}');
        expect(finalize).toHaveBeenCalled();

        expect(verbose).toHaveBeenCalledTimes(2);
        expect(verbose).toHaveBeenNthCalledWith(
          1,
          '[@modus/gimbal-plugin-sqlite]',
          'Saving new report for "master-did-something" command...',
        );
        expect(verbose).toHaveBeenNthCalledWith(2, '[@modus/gimbal-plugin-sqlite]', 'Saved new report!');
      });
    });
  });
});
