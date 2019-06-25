import { addColumn, createRenderer, renderDifference, renderDiffPercentage } from './render';
import { Table } from '@/typings/components/Table';
import { Metas } from '@/typings/plugin/last-value/util';

describe('@modus/gimbal-plugin-last-value/render', (): void => {
  describe('renderDiffPercentage', (): void => {
    it('should render a diff as a percent', (): void => {
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

    it('should render a diff as a negative percent', (): void => {
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

    it('should render just last value when no last value change', (): void => {
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

      const ret = renderDiffPercentage('10%', item);

      expect(ret).toBe('10%');
    });

    it('should render just last value when no last value diff', (): void => {
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

      const ret = renderDiffPercentage('10%', item);

      expect(ret).toBe('10%');
    });

    it('should decimalize', (): void => {
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
    it('should render difference in bytes', (): void => {
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

    it('should render difference in bytes as negative', (): void => {
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

    it('should render just last value', (): void => {
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

      const ret = renderDifference(10, item);

      expect(ret).toBe('10');
    });
  });

  describe('createRenderer', (): void => {
    it('should render values', (): void => {
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
      const meta: Metas = {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      };
      const renderer = createRenderer(config, meta);
      const ret = renderer(10, item);

      expect(ret).toBe('10\n  +8 B');
    });

    it('should render diff values', (): void => {
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
      const meta: Metas = {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      };
      const renderer = createRenderer(config, meta);
      const ret = renderer(20, item);

      expect(ret).toBe('20\n  +80%');
    });

    it('should render last value', (): void => {
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
      const meta: Metas = {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      };
      const renderer = createRenderer(config, meta);
      const ret = renderer(20, item);

      expect(ret).toBe('20');
    });

    it('should render empty string if no last value', (): void => {
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
      const meta: Metas = {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      };
      const renderer = createRenderer(config, meta);
      const ret = renderer(undefined, item);

      expect(ret).toBe('');
    });
  });

  describe('addColumn', (): void => {
    it('should add column', (): void => {
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

      addColumn(table as Table, config, {});

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

    it('should handle when no table', (): void => {
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

      addColumn(undefined, config, {});
    });
  });
});
