import realdeepmerge from 'deepmerge';
import sqlite3 from 'sqlite3';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Deepmerge = (x: any, y: any) => any;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Mkdirp = (filepath: string) => Promise<any>;

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-sqlite', (): void => {
  describe('no database stuff', (): void => {
    it('should initialize core', async (): Promise<void> => {
      const deepmergeMock = jest.fn();
      const bus = jest.fn();

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);

          return realdeepmerge(x, y);
        },
      );

      const { default: sqlite } = await import('./index');

      await sqlite(
        {
          bus,
          dir: 'foo',
        },
        {
          file: ':memory:',
        },
      );

      expect(deepmergeMock).toHaveBeenCalledWith(
        {
          file: 'gimbal.db',
          lastValue: false,
        },
        {
          file: ':memory:',
        },
      );

      expect(bus).not.toHaveBeenCalled();
    });

    it('should resolve path to file', async (): Promise<void> => {
      const deepmergeMock = jest.fn();
      const resolvePath = jest.fn().mockReturnValue('foo/bar');
      const bus = jest.fn();

      jest.doMock(
        '@modus/gimbal-core/lib/utils/fs',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): any => ({
          resolvePath,
        }),
      );

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);

          return realdeepmerge(x, y);
        },
      );

      const { default: sqlite } = await import('./index');

      await sqlite(
        {
          bus,
          commandOptions: {
            comment: true,
            cwd: 'cwd',
            verbose: false,
          },
          dir: 'foo',
        },
        {},
      );

      expect(deepmergeMock).toHaveBeenCalledWith(
        {
          file: 'gimbal.db',
          lastValue: false,
        },
        {},
      );

      expect(resolvePath).toHaveBeenCalledWith('cwd', 'gimbal.db');

      expect(bus).not.toHaveBeenCalled();
    });
  });

  describe('database stuff', (): void => {
    it('should create database and init last value', async (): Promise<void> => {
      const deepmergeMock = jest.fn();
      const resolvePath = jest.fn().mockReturnValue('foo/bar');
      const mkdirpMock = jest.fn().mockResolvedValue('good');
      const init = jest.fn().mockResolvedValue('good');
      const on = jest.fn();
      const bus = jest.fn().mockResolvedValue({
        on,
      });

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);

          return realdeepmerge(x, y);
        },
      );

      jest.doMock('mkdirp', (): Mkdirp => mkdirpMock);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('./last-value', (): any => ({
        init,
      }));

      const { default: sqlite } = await import('./index');

      await sqlite(
        {
          bus,
          commandOptions: {
            comment: true,
            cwd: 'cwd',
            verbose: false,
          },
          dir: 'foo',
        },
        {
          file: ':memory:',
          lastValue: true,
        },
      );

      expect(deepmergeMock).toHaveBeenCalledWith(
        {
          file: 'gimbal.db',
          lastValue: false,
        },
        {
          file: ':memory:',
          lastValue: true,
        },
      );

      expect(resolvePath).not.toHaveBeenCalled();
      expect(mkdirpMock).not.toHaveBeenCalled();

      expect(init).toHaveBeenCalledWith({
        db: new sqlite3.Database(':memory:'),
        file: ':memory:',
        lastValue: true,
        table: 'gimbal_archive',
      });

      expect(on.mock.calls).toEqual([
        ['plugin/last-value/report/get', expect.any(Function)],
        ['plugin/last-value/report/save', expect.any(Function)],
      ]);

      expect(bus).toHaveBeenCalledWith('event');
    });

    it('should trigger event listeners', async (): Promise<void> => {
      const deepmergeMock = jest.fn();
      const resolvePath = jest.fn().mockReturnValue('foo/bar');
      const mkdirpMock = jest.fn().mockResolvedValue('good');
      const getLastReport = jest.fn().mockResolvedValue('good');
      const init = jest.fn().mockResolvedValue('good');
      const saveLastReport = jest.fn().mockResolvedValue('good');

      const on = jest
        .fn()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .mockImplementation((eventName, cb): any => cb(eventName, { command: 'foo', report: 'bar' }));
      const bus = jest.fn().mockResolvedValue({
        on,
      });

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);

          return realdeepmerge(x, y);
        },
      );

      jest.doMock('mkdirp', (): Mkdirp => mkdirpMock);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('./last-value', (): any => ({
        getLastReport,
        init,
        saveLastReport,
      }));

      const { default: sqlite } = await import('./index');

      await sqlite(
        {
          bus,
          commandOptions: {
            comment: true,
            cwd: 'cwd',
            verbose: false,
          },
          dir: 'foo',
        },
        {
          file: ':memory:',
          lastValue: {
            table: 'hello_there',
          },
        },
      );

      expect(deepmergeMock).toHaveBeenCalledWith(
        {
          file: 'gimbal.db',
          lastValue: false,
        },
        {
          file: ':memory:',
          lastValue: {
            table: 'hello_there',
          },
        },
      );

      expect(resolvePath).not.toHaveBeenCalled();
      expect(mkdirpMock).not.toHaveBeenCalled();

      expect(init).toHaveBeenCalledWith({
        db: new sqlite3.Database(':memory:'),
        file: ':memory:',
        lastValue: {
          table: 'hello_there',
        },
        table: 'hello_there',
      });

      expect(getLastReport).toHaveBeenCalledWith('foo', {
        db: new sqlite3.Database(':memory:'),
        file: ':memory:',
        lastValue: {
          table: 'hello_there',
        },
        table: 'hello_there',
      });

      expect(saveLastReport).toHaveBeenCalledWith('foo', 'bar', {
        db: new sqlite3.Database(':memory:'),
        file: ':memory:',
        lastValue: {
          table: 'hello_there',
        },
        table: 'hello_there',
      });

      expect(on.mock.calls).toEqual([
        ['plugin/last-value/report/get', expect.any(Function)],
        ['plugin/last-value/report/save', expect.any(Function)],
      ]);

      expect(bus).toHaveBeenCalledWith('event');
    });
  });
});
