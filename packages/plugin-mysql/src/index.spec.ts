import realdeepmerge from 'deepmerge';
import { Emitter } from '@/typings/event';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
jest.mock('mysql', (): any => ({
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  createConnection: (): any => ({}),
}));

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Deepmerge = (x: any, y: any) => any;

const event: Emitter = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  fire: (): any => {},
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  on: (): any => {},
};

const Command = {};

beforeEach((): void => {
  jest.resetModules();
  jest.restoreAllMocks();
});

describe('@modus/gimbal-plugin-mysql', (): void => {
  describe('no database stuff', (): void => {
    it('should merge configs', async (): Promise<void> => {
      const deepmergeMock = jest.fn();

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);
          return realdeepmerge(x, y);
        },
      );

      const { default: plugin } = await import('./index');

      await plugin(
        {
          dir: 'foo',
          event,
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          program: Command as any,
          utils: {
            envOrDefault: (): string => 'foo',
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            getOptionsFromCommand: (): any => {},
            resolvePath: (): string => 'foo',
          },
        },
        {
          lastValue: false,
        },
      );

      expect(deepmergeMock).toHaveBeenCalledWith({ lastValue: false }, { lastValue: false });
    });
  });

  describe('database stuff', (): void => {
    it('should should handle connection error', async (): Promise<void> => {
      const deepmergeMock = jest.fn();
      const init = jest.fn().mockResolvedValue('good');
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const connect = jest.fn().mockImplementation((callback: any): any => callback(new Error('foobar')));

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);
          return realdeepmerge(x, y);
        },
      );

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('mysql', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        createConnection: (): any => ({
          connect,
        }),
      }));

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('./last-value', (): any => ({
        init,
      }));

      const { default: plugin } = await import('./index');

      const check = plugin(
        {
          dir: 'foo',
          event,
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          program: Command as any,
          utils: {
            envOrDefault: (): string => 'foo',
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            getOptionsFromCommand: (): any => {},
            resolvePath: (): string => 'foo',
          },
        },
        {
          lastValue: true,
        },
      );

      await expect(check).rejects.toThrow(new Error('foobar'));

      expect(deepmergeMock.mock.calls).toEqual([
        [{ lastValue: false }, { lastValue: true }],
        [{ lastValue: true, database: 'gimbal', table: 'gimbal_archive' }, {}],
      ]);
      expect(connect).toHaveBeenCalledWith(expect.any(Function));
      expect(init).not.toHaveBeenCalled();
    });

    it('should init last value', async (): Promise<void> => {
      const deepmergeMock = jest.fn();
      const init = jest.fn().mockResolvedValue('good');
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const connect = jest.fn().mockImplementation((callback: any): any => callback(null));

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);
          return realdeepmerge(x, y);
        },
      );

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('mysql', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        createConnection: (): any => ({
          connect,
        }),
      }));

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('./last-value', (): any => ({
        init,
      }));

      const { default: plugin } = await import('./index');

      await plugin(
        {
          dir: 'foo',
          event,
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          program: Command as any,
          utils: {
            envOrDefault: (): string => 'foo',
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            getOptionsFromCommand: (): any => {},
            resolvePath: (): string => 'foo',
          },
        },
        {
          lastValue: true,
        },
      );

      expect(deepmergeMock.mock.calls).toEqual([
        [{ lastValue: false }, { lastValue: true }],
        [{ lastValue: true, database: 'gimbal', table: 'gimbal_archive' }, {}],
      ]);
      expect(connect).toHaveBeenCalledWith(expect.any(Function));
      expect(init).toHaveBeenCalledWith(expect.any(Object), {
        lastValue: true,
        database: 'gimbal',
        table: 'gimbal_archive',
      });
    });

    it('should add event listeners', async (): Promise<void> => {
      const deepmergeMock = jest.fn();
      const init = jest.fn().mockResolvedValue('good');
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const connect = jest.fn().mockImplementation((callback: any): any => callback(null));
      const on = jest.fn();

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);
          return realdeepmerge(x, y);
        },
      );

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('mysql', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        createConnection: (): any => ({
          connect,
        }),
      }));

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('./last-value', (): any => ({
        init,
      }));

      const { default: plugin } = await import('./index');

      await plugin(
        {
          dir: 'foo',
          event: {
            ...event,
            on,
          },
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          program: Command as any,
          utils: {
            envOrDefault: (): string => 'foo',
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            getOptionsFromCommand: (): any => {},
            resolvePath: (): string => 'foo',
          },
        },
        {
          lastValue: true,
        },
      );

      expect(deepmergeMock.mock.calls).toEqual([
        [{ lastValue: false }, { lastValue: true }],
        [{ lastValue: true, database: 'gimbal', table: 'gimbal_archive' }, {}],
      ]);
      expect(connect).toHaveBeenCalledWith(expect.any(Function));
      expect(init).toHaveBeenCalledWith(expect.any(Object), {
        lastValue: true,
        database: 'gimbal',
        table: 'gimbal_archive',
      });

      expect(on.mock.calls).toEqual([
        ['plugin/last-value/report/get', expect.any(Function)],
        ['plugin/last-value/report/save', expect.any(Function)],
      ]);
    });

    it('should trigger event listeners', async (): Promise<void> => {
      const deepmergeMock = jest.fn();
      const getLastReport = jest.fn().mockResolvedValue('good');
      const init = jest.fn().mockResolvedValue('good');
      const saveLastReport = jest.fn().mockResolvedValue('good');
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const connect = jest.fn().mockImplementation((callback: any): any => callback(null));

      const on = jest
        .fn()
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .mockImplementation((eventName, cb): any => cb(eventName, { command: 'foo', report: 'bar' }));

      jest.doMock(
        'deepmerge',
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (): Deepmerge => (x: any, y: any): any => {
          deepmergeMock(x, y);
          return realdeepmerge(x, y);
        },
      );

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('mysql', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        createConnection: (): any => ({
          connect,
        }),
      }));

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('./last-value', (): any => ({
        getLastReport,
        init,
        saveLastReport,
      }));

      const { default: plugin } = await import('./index');

      await plugin(
        {
          dir: 'foo',
          event: {
            ...event,
            on,
          },
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          program: Command as any,
          utils: {
            envOrDefault: (): string => 'foo',
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            getOptionsFromCommand: (): any => {},
            resolvePath: (): string => 'foo',
          },
        },
        {
          lastValue: {
            database: 'foo-db',
            table: 'foo-table',
          },
        },
      );

      expect(deepmergeMock.mock.calls).toEqual([
        [
          { lastValue: false },
          {
            lastValue: {
              database: 'foo-db',
              table: 'foo-table',
            },
          },
        ],
        [
          {
            lastValue: {
              database: 'foo-db',
              table: 'foo-table',
            },
            database: 'gimbal',
            table: 'gimbal_archive',
          },
          {
            database: 'foo-db',
            table: 'foo-table',
          },
        ],
      ]);

      expect(init).toHaveBeenCalledWith(expect.any(Object), {
        lastValue: {
          database: 'foo-db',
          table: 'foo-table',
        },
        database: 'foo-db',
        table: 'foo-table',
      });

      expect(getLastReport).toHaveBeenCalledWith('foo', expect.any(Object), {
        lastValue: {
          database: 'foo-db',
          table: 'foo-table',
        },
        database: 'foo-db',
        table: 'foo-table',
      });

      expect(saveLastReport).toHaveBeenCalledWith('foo', 'bar', expect.any(Object), {
        lastValue: {
          database: 'foo-db',
          table: 'foo-table',
        },
        database: 'foo-db',
        table: 'foo-table',
      });
    });
  });
});
