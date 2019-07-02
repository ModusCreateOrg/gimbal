import { PluginOptions } from '@/typings/config/plugin';
import { doesItemFail, getItemDiff } from './util';

const pluginOptions: PluginOptions = {
  bus(): void {},
  dir: 'foo',
};

describe('@modus/gimbal-plugin-last-value/util', (): void => {
  describe('getItemDiff', (): void => {
    describe('unknown type', (): void => {
      it('should handle unknown type', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await getItemDiff(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3',
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBeUndefined();

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });
    });

    describe('number', (): void => {
      it('should get diff of a number', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await getItemDiff(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3',
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toEqual({
          change: (1 / 3) * 100, // % of change
          diff: 1,
        });

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });
    });

    describe('percentage', (): void => {
      it('should get diff of a percentage', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'percentage',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await getItemDiff(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2%',
            lastValueChange: 0.01,
            lastValueDiff: 0.01,
            rawLabel: 'Foo',
            rawLastValue: 0.02,
            rawValue: 0.03,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3%',
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toEqual({
          change: (1 / 3) * 100, // % of change
          diff: 0.03 - 0.02,
        });

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });
    });

    describe('size', (): void => {
      it('should get diff of a size', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'size',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await getItemDiff(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3',
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toEqual({
          change: (1 / 3) * 100, // % of change
          diff: 1,
        });

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });
    });
  });

  describe('doesItemFail', (): void => {
    describe('unknown type', (): void => {
      it('should handle unknown type', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 1,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe(false);

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });

      it('should handle null last value', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const item = {
          command: 'foo-command',
          label: 'Foo',
          lastValue: '1',
          lastValueChange: 1,
          lastValueDiff: 1,
          rawLabel: 'Foo',
          rawLastValue: 2,
          rawValue: 3,
          report: {
            success: true,
          },
          success: true,
          type: 'foo',
          value: '3',
        };

        delete item.lastValue;

        const ret = await doesItemFail(
          item,
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 1,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe(false);

        expect(bus).not.toHaveBeenCalled();
        expect(getMeta).not.toHaveBeenCalled();
      });

      it('should handle last and current value being the same', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const item = {
          command: 'foo-command',
          label: 'Foo',
          lastValue: '3',
          lastValueChange: 0,
          lastValueDiff: 0,
          rawLabel: 'Foo',
          rawLastValue: 3,
          rawValue: 3,
          report: {
            success: true,
          },
          success: true,
          type: 'foo',
          value: '3',
        };

        delete item.lastValue;

        const ret = await doesItemFail(
          item,
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 1,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe(false);

        expect(bus).not.toHaveBeenCalled();
        expect(getMeta).not.toHaveBeenCalled();
      });
    });

    describe('number', (): void => {
      it('should not fail', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 50,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe(false);

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });

      it('should fail threshold', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 50,
              number: 0,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe('number');

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });

      it('should fail', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdTypes: {
            Foo: 'number',
          },
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 20,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe('numberDiffPercentage');

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });
    });

    describe('percentage', (): void => {
      it('should not fail', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'percentage',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2%',
            lastValueChange: 0.01,
            lastValueDiff: 0.01,
            rawLabel: 'Foo',
            rawLastValue: 0.02,
            rawValue: 0.03,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3%',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 50,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe(false);

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });

      it('should not fail with strings as raw values', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'percentage',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2%',
            lastValueChange: 0.01,
            lastValueDiff: 0.01,
            rawLabel: 'Foo',
            rawLastValue: '2%',
            rawValue: '3%',
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3%',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 50,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe(false);

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });

      it('should fail threshold', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'percentage',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2%',
            lastValueChange: 0.01,
            lastValueDiff: 0.01,
            rawLabel: 'Foo',
            rawLastValue: 0.02,
            rawValue: 0.03,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3%',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 50,
              number: 1,
              percentage: 0,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe('percentage');

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });

      it('should fail', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdTypes: {
            Foo: 'percentage',
          },
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2%',
            lastValueChange: 0.01,
            lastValueDiff: 0.01,
            rawLabel: 'Foo',
            rawLastValue: 0.02,
            rawValue: 0.03,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3%',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 20,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe('percentageDiffPercentage');

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });
    });

    describe('size', (): void => {
      it('should not fail', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'size',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2 KB',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3 KB',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 50,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe(false);

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });

      it('should fail threshold', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdType: 'size',
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2 KB',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3 KB',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 50,
              number: 1,
              percentage: 1,
              size: 0,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe('size');

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });

      it('should fail', async (): Promise<void> => {
        const getMeta = jest.fn().mockReturnValue({
          thresholdLimit: 'upper',
          thresholdTypes: {
            Foo: 'size',
          },
        });
        const bus = jest.fn().mockResolvedValue({
          getMeta,
        });

        const ret = await doesItemFail(
          {
            command: 'foo-command',
            label: 'Foo',
            lastValue: '2 KB',
            lastValueChange: 1,
            lastValueDiff: 1,
            rawLabel: 'Foo',
            rawLastValue: 2,
            rawValue: 3,
            report: {
              success: true,
            },
            success: true,
            type: 'foo',
            value: '3 KB',
          },
          {
            failOnBreach: true,
            saveOnlyOnSuccess: true,
            thresholds: {
              diffPercentage: 20,
              number: 1,
              percentage: 1,
              size: 1,
            },
          },
          {
            ...pluginOptions,
            bus,
          },
        );

        expect(ret).toBe('sizeDiffPercentage');

        expect(bus).toHaveBeenCalledWith('module/registry');
        expect(getMeta).toHaveBeenCalledWith('foo');
      });
    });
  });
});
