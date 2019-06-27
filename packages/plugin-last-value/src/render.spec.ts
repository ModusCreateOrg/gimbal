import { Table } from '@/typings/components/Table';

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-last-value/render', (): void => {
  describe('renderDiffPercentage', (): void => {
    it('should render a diff as a percent', async (): Promise<void> => {
      const { renderDiffPercentage } = await import('./render');

      const ret = renderDiffPercentage('10%', {
        command: 'foo',
        label: 'Foo',
        lastValue: '2%',
        lastValueChange: 80,
        lastValueDiff: 8,
        rawLabel: 'Foo',
        rawLastValue: 0.02,
        rawValue: 0.1,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10%',
      });

      expect(ret).toBe('10%\n  +80%');
    });

    it('should render a diff as a negative percent', async (): Promise<void> => {
      const { renderDiffPercentage } = await import('./render');

      const ret = renderDiffPercentage('10%', {
        command: 'foo',
        label: 'Foo',
        lastValue: '2%',
        lastValueChange: -80,
        lastValueDiff: -8,
        rawLabel: 'Foo',
        rawLastValue: 0.02,
        rawValue: 0.1,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10%',
      });

      expect(ret).toBe('10%\n  -80%');
    });

    it('should render just last value when no last value change', async (): Promise<void> => {
      const item = {
        command: 'foo',
        label: 'Foo',
        lastValue: '2%',
        lastValueChange: -80,
        lastValueDiff: -8,
        rawLabel: 'Foo',
        rawLastValue: 0.02,
        rawValue: 0.1,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10%',
      };

      delete item.lastValueChange;

      const { renderDiffPercentage } = await import('./render');

      const ret = renderDiffPercentage('10%', item);

      expect(ret).toBe('10%');
    });

    it('should render just last value when no last value diff', async (): Promise<void> => {
      const item = {
        command: 'foo',
        label: 'Foo',
        lastValue: '2%',
        lastValueChange: -80,
        lastValueDiff: -8,
        rawLabel: 'Foo',
        rawLastValue: 0.02,
        rawValue: 0.1,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10%',
      };

      delete item.lastValueDiff;

      const { renderDiffPercentage } = await import('./render');

      const ret = renderDiffPercentage('10%', item);

      expect(ret).toBe('10%');
    });

    it('should decimalize', async (): Promise<void> => {
      const { renderDiffPercentage } = await import('./render');

      const ret = renderDiffPercentage('10%', {
        command: 'foo',
        label: 'Foo',
        lastValue: '2%',
        lastValueChange: -80.1,
        lastValueDiff: -8,
        rawLabel: 'Foo',
        rawLastValue: 0.02,
        rawValue: 0.1,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10%',
      });

      expect(ret).toBe('10%\n  -80.10%');
    });
  });

  describe('renderDifference', (): void => {
    it('should render difference in bytes', async (): Promise<void> => {
      const { renderDifference } = await import('./render');

      const ret = renderDifference(10, {
        command: 'foo',
        label: 'Foo',
        lastValue: '2 B',
        lastValueChange: 80,
        lastValueDiff: 8,
        rawLabel: 'Foo',
        rawLastValue: 2,
        rawValue: 10,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10 B',
      });

      expect(ret).toBe('10\n  +8 B');
    });

    it('should render difference in bytes as negative', async (): Promise<void> => {
      const { renderDifference } = await import('./render');

      const ret = renderDifference(10, {
        command: 'foo',
        label: 'Foo',
        lastValue: '2 B',
        lastValueChange: 80,
        lastValueDiff: -8,
        rawLabel: 'Foo',
        rawLastValue: 2,
        rawValue: 10,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10 B',
      });

      expect(ret).toBe('10\n  -8 B');
    });

    it('should render just last value', async (): Promise<void> => {
      const item = {
        command: 'foo',
        label: 'Foo',
        lastValue: '2 B',
        lastValueChange: 80,
        lastValueDiff: 8,
        rawLabel: 'Foo',
        rawLastValue: 2,
        rawValue: 10,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10 B',
      };

      delete item.lastValueDiff;

      const { renderDifference } = await import('./render');

      const ret = renderDifference(10, item);

      expect(ret).toBe('10');
    });
  });

  describe('createRenderer', (): void => {
    it('should render values', async (): Promise<void> => {
      const config = {
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };
      const item = {
        command: 'foo',
        label: 'Foo',
        lastValue: '2 B',
        lastValueChange: 80,
        lastValueDiff: 8,
        rawLabel: 'Foo',
        rawLastValue: 2,
        rawValue: 10,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '10 B',
      };

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        }),
      }));

      const { createRenderer } = await import('./render');

      const renderer = createRenderer(config);
      const ret = renderer(10, item);

      expect(ret).toBe('10\n  +8 B');
    });

    it('should render diff values', async (): Promise<void> => {
      const config = {
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 10,
          number: 18,
          percentage: 1,
          size: 1,
        },
      };
      const item = {
        command: 'foo',
        label: 'Foo',
        lastValue: '2 B',
        lastValueChange: 80,
        lastValueDiff: 18,
        rawLabel: 'Foo',
        rawLastValue: 2,
        rawValue: 20,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '20 B',
      };

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        }),
      }));

      const { createRenderer } = await import('./render');

      const renderer = createRenderer(config);
      const ret = renderer(20, item);

      expect(ret).toBe('20\n  +80%');
    });

    it('should render last value', async (): Promise<void> => {
      const config = {
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 90,
          number: 18,
          percentage: 1,
          size: 1,
        },
      };
      const item = {
        command: 'foo',
        label: 'Foo',
        lastValue: '2 B',
        lastValueChange: 80,
        lastValueDiff: 18,
        rawLabel: 'Foo',
        rawLastValue: 2,
        rawValue: 20,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '20 B',
      };

      const { createRenderer } = await import('./render');

      const renderer = createRenderer(config);
      const ret = renderer(20, item);

      expect(ret).toBe('20');
    });

    it('should render empty string if no last value', async (): Promise<void> => {
      const config = {
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 90,
          number: 18,
          percentage: 1,
          size: 1,
        },
      };
      const item = {
        command: 'foo',
        label: 'Foo',
        lastValue: '2 B',
        lastValueChange: 80,
        lastValueDiff: 18,
        rawLabel: 'Foo',
        rawLastValue: 2,
        rawValue: 20,
        report: { success: true },
        success: true,
        type: 'foo',
        value: '20 B',
      };

      const { createRenderer } = await import('./render');

      const renderer = createRenderer(config);
      const ret = renderer(undefined, item);

      expect(ret).toBe('');
    });
  });

  describe('addColumn', (): void => {
    it('should add column', async (): Promise<void> => {
      const addColumnMock = jest.fn();
      const findColumn = jest.fn().mockReturnValue(3);
      const table = {
        add(): void {},
        find(): void {},
        get(): void {},
        getColumn(): void {},
        remove(): void {},
        removeColumn(): void {},
        render: (): string => 'foo',
        set(): void {},
        addColumn: addColumnMock,
        findColumn,
      };
      const config = {
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { addColumn } = await import('./render');

      addColumn(table as Table, config);

      expect(addColumnMock).toHaveBeenCalledWith(
        {
          header: 'Last Value',
          key: 'lastValue',
          align: 'center',
          renderer: expect.any(Function),
        },
        4,
      );

      expect(findColumn).toHaveBeenCalledWith(expect.any(Function), true);
    });

    it('should handle when no table', async (): Promise<void> => {
      const config = {
        failOnBreach: false,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { addColumn } = await import('./render');

      addColumn(undefined, config);
    });
  });
});
