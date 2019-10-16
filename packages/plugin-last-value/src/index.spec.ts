import { Context } from '@/typings/context';

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-last-value', (): void => {
  it('should add cli option and listeners', async (): Promise<void> => {
    const add = jest.fn();
    const on = jest.fn();

    const contextMock: unknown = {
      args: {
        add,
      },
      event: {
        on,
      },
    };
    const context = contextMock as Context;

    const { default: plugin } = await import('./index');

    await plugin(
      {
        context,
        dir: 'foo',
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

    expect(add).toHaveBeenCalledWith({
      'check-last-values': {
        default: true,
        type: 'boolean',
      },
    });

    expect(on).toHaveBeenCalledTimes(4);
    expect(on).toHaveBeenNthCalledWith(1, 'output/cli/report/end', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(2, 'output/markdown/render/table/start', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(3, 'command/*/action/end', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(4, 'command/*/end', expect.any(Function));
  });

  it('should handle listeners', async (): Promise<void> => {
    const add = jest.fn();
    const get = jest.fn().mockReturnValue(true);

    const on = jest
      .fn()
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      .mockImplementation((eventName, cb): any => cb(eventName, { report: 'bar', table: 'table' }));

    const contextMock: unknown = {
      args: {
        add,
      },
      config: {
        get,
      },
      event: {
        on,
      },
    };
    const context = contextMock as Context;

    const addColumn = jest.fn().mockResolvedValue('foo');
    const getLastReport = jest.fn().mockResolvedValue('foo');
    const saveReport = jest.fn().mockResolvedValue('foo');

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
        context,
        dir: 'foo',
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

    expect(add).toHaveBeenCalledWith({
      'check-last-values': {
        default: true,
        type: 'boolean',
      },
    });

    expect(on).toHaveBeenCalledTimes(4);
    expect(on).toHaveBeenNthCalledWith(1, 'output/cli/report/end', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(2, 'output/markdown/render/table/start', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(3, 'command/*/action/end', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(4, 'command/*/end', expect.any(Function));

    expect(get).toHaveBeenCalledTimes(4);
    expect(get).toHaveBeenNthCalledWith(1, 'configs.checkLastValues');
    expect(get).toHaveBeenNthCalledWith(2, 'configs.checkLastValues');
    expect(get).toHaveBeenNthCalledWith(3, 'configs.checkLastValues');
    expect(get).toHaveBeenNthCalledWith(4, 'configs.checkLastValues');

    expect(addColumn).toHaveBeenCalledTimes(2);
    // from 'output/cli/report/end' event
    expect(addColumn).toHaveBeenNthCalledWith(
      1,
      'table',
      {
        context,
        dir: 'foo',
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
    // from 'output/markdown/render/table/start' event
    expect(addColumn).toHaveBeenNthCalledWith(
      2,
      'table',
      {
        context,
        dir: 'foo',
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

    expect(getLastReport).toHaveBeenCalledWith(
      'command/*/action/end',
      {
        context,
        dir: 'foo',
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
      'bar',
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
      context,
    );
  });

  it('should not fire listeners', async (): Promise<void> => {
    const add = jest.fn();
    const get = jest.fn().mockReturnValue(false);
    const on = jest
      .fn()
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      .mockImplementation((eventName, cb): any => cb(eventName, { report: 'bar', table: 'table' }));
    const addColumn = jest.fn().mockResolvedValue('foo');
    const getLastReport = jest.fn().mockResolvedValue('foo');
    const saveReport = jest.fn().mockResolvedValue('foo');

    const contextMock: unknown = {
      args: {
        add,
      },
      config: {
        get,
      },
      event: {
        on,
      },
    };
    const context = contextMock as Context;

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
        context,
        dir: 'foo',
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

    expect(add).toHaveBeenCalledWith({
      'check-last-values': {
        default: true,
        type: 'boolean',
      },
    });

    expect(on).toHaveBeenCalledTimes(4);
    expect(on).toHaveBeenNthCalledWith(1, 'output/cli/report/end', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(2, 'output/markdown/render/table/start', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(3, 'command/*/action/end', expect.any(Function));
    expect(on).toHaveBeenNthCalledWith(4, 'command/*/end', expect.any(Function));

    expect(addColumn).not.toHaveBeenCalled();

    expect(getLastReport).not.toHaveBeenCalled();

    expect(saveReport).not.toHaveBeenCalled();
  });
});
