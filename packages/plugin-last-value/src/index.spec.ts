import { Emitter } from '@/typings/event';

const event: Emitter = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  fire: (): any => {},
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  on: (): any => {},
};

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-last-value', (): void => {
  it('should add option to commander', async (): Promise<void> => {
    const option = jest.fn();
    const Command = {
      option,
    };

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
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      },
    );

    expect(option).toHaveBeenCalledWith(
      '--no-check-last-values',
      'Set to disable checking last values vs current values.',
      true,
    );
  });

  it('should add listeners', async (): Promise<void> => {
    const option = jest.fn();
    const on = jest.fn();
    const Command = {
      option,
    };

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
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      },
    );

    expect(option).toHaveBeenCalledWith(
      '--no-check-last-values',
      'Set to disable checking last values vs current values.',
      true,
    );

    expect(on.mock.calls).toEqual([
      ['output/cli/report/end', expect.any(Function)],
      ['output/markdown/render/table/start', expect.any(Function)],
      ['command/*/action/end', expect.any(Function)],
      ['command/*/end', expect.any(Function)],
    ]);
  });

  it('should handle listeners', async (): Promise<void> => {
    const option = jest.fn();
    const on = jest
      .fn()
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      .mockImplementation((eventName, cb): any =>
        cb(eventName, { commandOptions: { checkLastValues: true }, report: 'bar', table: 'table' }),
      );
    const addColumn = jest.fn().mockResolvedValue('foo');
    const getLastReport = jest.fn().mockResolvedValue('foo');
    const saveReport = jest.fn().mockResolvedValue('foo');
    const Command = {
      option,
    };

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('./render', (): any => ({
      addColumn,
    }));

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('./storage', (): any => ({
      getLastReport,
      saveReport,
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
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      },
    );

    expect(option).toHaveBeenCalledWith(
      '--no-check-last-values',
      'Set to disable checking last values vs current values.',
      true,
    );

    expect(on.mock.calls).toEqual([
      ['output/cli/report/end', expect.any(Function)],
      ['output/markdown/render/table/start', expect.any(Function)],
      ['command/*/action/end', expect.any(Function)],
      ['command/*/end', expect.any(Function)],
    ]);

    expect(addColumn.mock.calls).toEqual([
      // from 'output/cli/report/end' event
      [
        'table',
        {
          failOnBreach: false,
          saveOnlyOnSuccess: true,
          thresholds: {
            diffPercentage: 50,
            number: 1,
            percentage: 1,
            size: 1,
          },
        },
      ],
      // from 'output/markdown/render/table/start' event
      [
        'table',
        {
          failOnBreach: false,
          saveOnlyOnSuccess: true,
          thresholds: {
            diffPercentage: 50,
            number: 1,
            percentage: 1,
            size: 1,
          },
        },
      ],
    ]);

    expect(getLastReport).toHaveBeenCalledWith(
      'command/*/action/end',
      {
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      },
      'bar',
      {
        fire: expect.any(Function),
        on: expect.any(Function),
      },
    );

    expect(saveReport).toHaveBeenCalledWith(
      'command/*/end',
      {
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      },
      'bar',
      {
        fire: expect.any(Function),
        on: expect.any(Function),
      },
    );
  });

  it('should not fire listeners', async (): Promise<void> => {
    const option = jest.fn();
    const on = jest
      .fn()
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      .mockImplementation((eventName, cb): any =>
        cb(eventName, { commandOptions: { checkLastValues: false }, report: 'bar', table: 'table' }),
      );
    const addColumn = jest.fn().mockResolvedValue('foo');
    const getLastReport = jest.fn().mockResolvedValue('foo');
    const saveReport = jest.fn().mockResolvedValue('foo');
    const Command = {
      option,
    };

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('./render', (): any => ({
      addColumn,
    }));

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('./storage', (): any => ({
      getLastReport,
      saveReport,
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
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      },
    );

    expect(option).toHaveBeenCalledWith(
      '--no-check-last-values',
      'Set to disable checking last values vs current values.',
      true,
    );

    expect(on.mock.calls).toEqual([
      ['output/cli/report/end', expect.any(Function)],
      ['output/markdown/render/table/start', expect.any(Function)],
      ['command/*/action/end', expect.any(Function)],
      ['command/*/end', expect.any(Function)],
    ]);

    expect(addColumn).not.toHaveBeenCalled();

    expect(getLastReport).not.toHaveBeenCalled();

    expect(saveReport).not.toHaveBeenCalled();
  });
});
