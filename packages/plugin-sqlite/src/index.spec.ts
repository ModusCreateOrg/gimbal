import realdeepmerge from 'deepmerge';
import { Emitter } from '@/typings/event';

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
});

describe('@modus/gimbal-plugin-sqlite', (): void => {
  it('should initialize core', async (): Promise<void> => {
    const deepmergeMock = jest.fn();

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
        dir: 'foo',
        event,
        modules: {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          get: (): any => {},
          metas: {},
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          register: (): any => {},
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
  });

  it('should resolve path to file', async (): Promise<void> => {
    const deepmergeMock = jest.fn();
    const resolvePath = jest.fn().mockReturnValue('foo/bar');

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
        commandOptions: {
          comment: true,
          cwd: 'cwd',
          verbose: false,
        },
        dir: 'foo',
        event,
        modules: {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          get: (): any => {},
          metas: {},
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          register: (): any => {},
        },
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        program: Command as any,
        utils: {
          envOrDefault: (): string => 'foo',
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          getOptionsFromCommand: (): any => {},
          resolvePath,
        },
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
  });
});
