import { doesItemFail, getItemDiff } from './util';

describe('@modus/gimbal-plugin-last-value/util', (): void => {
  describe('getItemDiff', (): void => {
    describe('unknown type', (): void => {
      it('should handle unknown type', (): void => {
        const ret = getItemDiff(
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
            foo: {
              thresholdLimit: 'upper',
            },
          },
        );

        expect(ret).toBeUndefined();
      });
    });

    describe('number', (): void => {
      it('should get diff of a number', (): void => {
        const ret = getItemDiff(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'number',
            },
          },
        );

        expect(ret).toEqual({
          change: (1 / 3) * 100, // % of change
          diff: 1,
        });
      });
    });

    describe('percentage', (): void => {
      it('should get diff of a percentage', (): void => {
        const ret = getItemDiff(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'percentage',
            },
          },
        );

        expect(ret).toEqual({
          change: (1 / 3) * 100, // % of change
          diff: 0.03 - 0.02,
        });
      });
    });

    describe('size', (): void => {
      it('should get diff of a size', (): void => {
        const ret = getItemDiff(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'size',
            },
          },
        );

        expect(ret).toEqual({
          change: (1 / 3) * 100, // % of change
          diff: 1,
        });
      });
    });
  });

  describe('doesItemFail', (): void => {
    describe('unknown type', (): void => {
      it('should handle unknown type', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
            },
          },
        );

        expect(ret).toBe(false);
      });

      it('should handle null last value', (): void => {
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

        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
            },
          },
        );

        expect(ret).toBe(false);
      });

      it('should handle last and current value being the same', (): void => {
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

        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
            },
          },
        );

        expect(ret).toBe(false);
      });
    });

    describe('number', (): void => {
      it('should not fail', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'number',
            },
          },
        );

        expect(ret).toBe(false);
      });

      it('should fail threshold', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'number',
            },
          },
        );

        expect(ret).toBe('number');
      });

      it('should fail', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdTypes: {
                Foo: 'number',
              },
            },
          },
        );

        expect(ret).toBe('numberDiffPercentage');
      });
    });

    describe('percentage', (): void => {
      it('should not fail', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'percentage',
            },
          },
        );

        expect(ret).toBe(false);
      });

      it('should not fail with strings as raw values', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'percentage',
            },
          },
        );

        expect(ret).toBe(false);
      });

      it('should fail threshold', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'percentage',
            },
          },
        );

        expect(ret).toBe('percentage');
      });

      it('should fail', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdTypes: {
                Foo: 'percentage',
              },
            },
          },
        );

        expect(ret).toBe('percentageDiffPercentage');
      });
    });

    describe('size', (): void => {
      it('should not fail', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'size',
            },
          },
        );

        expect(ret).toBe(false);
      });

      it('should fail threshold', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdType: 'size',
            },
          },
        );

        expect(ret).toBe('size');
      });

      it('should fail', (): void => {
        const ret = doesItemFail(
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
            foo: {
              thresholdLimit: 'upper',
              thresholdTypes: {
                Foo: 'size',
              },
            },
          },
        );

        expect(ret).toBe('sizeDiffPercentage');
      });
    });
  });
});
