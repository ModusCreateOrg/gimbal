import { Database } from 'sqlite3';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type SqliteGetCb = (error: Error | void, row?: any) => void;

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-sqlite/last-value', (): void => {
  describe('init', (): void => {
    it('should reject if no database provided', async (): Promise<void> => {
      const { init } = await import('./index');

      const check = init({
        table: 'my-table',
      });

      await expect(check).rejects.toThrow(new Error('no database connected'));
    });

    it('should run prepared statement to create table', async (): Promise<void> => {
      const { init } = await import('./index');

      const db = new Database(':memory:');

      const finalize = jest.fn().mockImplementationOnce((cb: () => void): void => cb());
      const run = jest.fn();

      const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

      prepare.mockReturnValueOnce({
        finalize,
        run,
      });

      await init({
        db,
        table: 'my-table',
      });

      expect(prepare).toHaveBeenCalled();
      expect(run).toHaveBeenCalledWith();
      expect(finalize).toHaveBeenCalled();
    });
  });

  describe('getLastReport', (): void => {
    it('should reject if no database provided', async (): Promise<void> => {
      const { getLastReport } = await import('./index');

      const check = getLastReport('did-something', {
        table: 'my-table',
      });

      await expect(check).rejects.toThrow(new Error('no database connected'));
    });

    it('should handle statement error', async (): Promise<void> => {
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

      const check = getLastReport('did-something', {
        db,
        table: 'my-table',
      });

      await expect(check).rejects.toThrow(new Error('foobar'));

      expect(prepare).toHaveBeenCalled();
      expect(get).toHaveBeenCalledWith('did-something', expect.any(Function));
      expect(finalize).toHaveBeenCalled();
    });

    it('should resolve with row', async (): Promise<void> => {
      const { getLastReport } = await import('./index');

      const db = new Database(':memory:');

      const finalize = jest.fn();
      const get = jest.fn().mockImplementationOnce((_command: string, cb: SqliteGetCb): void => cb(undefined, 'row'));

      const prepare = jest.spyOn(db, 'prepare') as jest.Mock;

      prepare.mockReturnValueOnce({
        finalize,
        get,
      });

      const ret = await getLastReport('did-something', {
        db,
        table: 'my-table',
      });

      expect(ret).toBe('row');

      expect(prepare).toHaveBeenCalled();
      expect(get).toHaveBeenCalledWith('did-something', expect.any(Function));
      expect(finalize).toHaveBeenCalled();
    });
  });

  describe('saveLastReport', (): void => {
    it('should reject if no database provided', async (): Promise<void> => {
      const { saveLastReport } = await import('./index');

      const check = saveLastReport(
        'did-something',
        {
          success: true,
        },
        {
          table: 'my-table',
        },
      );

      await expect(check).rejects.toThrow(new Error('no database connected'));
    });

    it('should run prepared statement to insert row', async (): Promise<void> => {
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
      );

      expect(prepare).toHaveBeenCalled();
      expect(run).toHaveBeenCalledWith('did-something', expect.any(Number), '{"success":true}');
      expect(finalize).toHaveBeenCalled();
    });
  });
});
