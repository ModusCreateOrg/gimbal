beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-last-value', (): void => {
  it('should add option to commander', async (): Promise<void> => {
    const option = jest.fn();
    const bus = jest
      .fn()
      .mockResolvedValueOnce({
        on(): void {},
      })
      .mockResolvedValueOnce({
        option,
      });

    const { default: plugin } = await import('./index');

    await plugin(
      {
        bus,
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

    expect(option).toHaveBeenCalledWith(
      '--no-check-last-values',
      'Set to disable checking last values vs current values.',
      true,
    );

    expect(bus.mock.calls).toEqual([['event'], ['commander']]);
  });

  it('should add listeners', async (): Promise<void> => {
    const option = jest.fn();
    const on = jest.fn();

    const bus = jest
      .fn()
      .mockResolvedValueOnce({
        on,
      })
      .mockResolvedValueOnce({
        option,
      });

    const { default: plugin } = await import('./index');

    await plugin(
      {
        bus,
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

    expect(bus.mock.calls).toEqual([['event'], ['commander']]);
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

    const bus = jest
      .fn()
      .mockResolvedValueOnce({
        on,
      })
      .mockResolvedValueOnce({
        option,
      });

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
        bus,
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
          bus,
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
      ],
      // from 'output/markdown/render/table/start' event
      [
        'table',
        {
          bus: expect.any(Function),
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
      ],
    ]);

    expect(getLastReport).toHaveBeenCalledWith(
      'command/*/action/end',
      {
        bus: expect.any(Function),
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
      {
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
        on: expect.any(Function),
      },
    );

    expect(bus.mock.calls).toEqual([['event'], ['commander']]);
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

    const bus = jest
      .fn()
      .mockResolvedValueOnce({
        on,
      })
      .mockResolvedValueOnce({
        option,
      });

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
        bus,
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

    expect(bus.mock.calls).toEqual([['event'], ['commander']]);
  });
});
