import { PluginOptions } from '@/typings/config/plugin';
import { Context } from '@/typings/context';

const pluginOptions: Pick<PluginOptions, 'dir'> = {
  dir: 'foo',
};

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-last-value/storage', (): void => {
  describe('getLastReport', (): void => {
    it('should handle no last report', async (): Promise<void> => {
      const fire = jest.fn().mockResolvedValue({ rets: [] });

      const contextMock: unknown = {
        event: {
          fire,
        },
      };
      const context = contextMock as Context;

      const report = { success: true };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, context }, config, report);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
    });

    it('should handle no child data', async (): Promise<void> => {
      const fire = jest.fn().mockResolvedValue({
        rets: [{ report: {} }],
      });

      const contextMock: unknown = {
        event: {
          fire,
        },
      };
      const context = contextMock as Context;

      const report = { success: true };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, context }, config, report);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
    });

    it('should handle no parent data', async (): Promise<void> => {
      const fire = jest.fn().mockResolvedValue({
        rets: [
          {
            report: {
              data: [
                {
                  data: [
                    {
                      label: 'Bar',
                      rawLabel: 'Bar',
                      rawValue: 3,
                      success: true,
                      type: 'size',
                      value: '3',
                    },
                  ],
                  label: 'Foo',
                  rawLabel: 'Foo',
                  success: true,
                  type: 'size',
                },
              ],
              success: true,
              type: 'size',
            },
          },
        ],
      });

      const contextMock: unknown = {
        event: {
          fire,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        success: true,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, context }, config, report);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
    });

    it('should handle no matched child data', async (): Promise<void> => {
      const fire = jest.fn().mockResolvedValue({
        rets: [
          {
            report: {
              data: [
                {
                  data: [
                    {
                      label: 'Bar',
                      rawLabel: 'Bar',
                      rawValue: 3,
                      success: true,
                      type: 'size',
                      value: '3',
                    },
                  ],
                  label: 'Foo',
                  rawLabel: 'Foo',
                  success: true,
                  type: 'size',
                },
              ],
              success: true,
              type: 'size',
            },
          },
        ],
      });

      const contextMock: unknown = {
        event: {
          fire,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 3,
                success: true,
                type: 'size',
                value: '3',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        success: true,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, context }, config, report);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
    });

    it('should handle not changing success', async (): Promise<void> => {
      const getMeta = jest.fn().mockReturnValue({});
      const fire = jest.fn().mockResolvedValue({
        rets: [
          {
            report: {
              data: [
                {
                  data: [
                    {
                      label: 'Foo',
                      rawLabel: 'Foo',
                      rawValue: 3,
                      success: true,
                      type: 'size',
                      value: '3',
                    },
                  ],
                  label: 'Foo',
                  rawLabel: 'Foo',
                  success: true,
                  type: 'size',
                },
              ],
              success: true,
              type: 'size',
            },
          },
        ],
      });

      const contextMock: unknown = {
        event: {
          fire,
        },
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 10,
                success: true,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: false,
            type: 'size',
          },
        ],
        success: false,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, context }, config, report);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(getMeta).toHaveBeenCalledTimes(3);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'size');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'size');
      expect(getMeta).toHaveBeenNthCalledWith(3, 'size');
    });

    it('should apply last values on report', async (): Promise<void> => {
      const getMeta = jest.fn().mockReturnValue({
        thresholdLimit: 'upper',
        thresholdType: 'number',
      });
      const fire = jest.fn().mockResolvedValue({
        rets: [
          {
            report: {
              data: [
                {
                  data: [
                    {
                      label: 'Foo',
                      rawLabel: 'Foo',
                      rawValue: 2,
                      success: true,
                      type: 'size',
                      value: '2',
                    },
                  ],
                  label: 'Foo',
                  rawLabel: 'Foo',
                  success: true,
                  type: 'size',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'size',
            },
          },
        ],
      });

      const contextMock: unknown = {
        event: {
          fire,
        },
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 3,
                success: true,
                type: 'size',
                value: '3',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, context }, config, report);

      expect(report).toEqual({
        data: [
          {
            data: [
              {
                label: 'Foo',
                lastValue: '2',
                lastValueChange: (1 / 3) * 100,
                lastValueDiff: 1,
                rawLabel: 'Foo',
                rawLastValue: 2,
                rawValue: 3,
                success: true,
                type: 'size',
                value: '3',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'size',
      });

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(getMeta).toHaveBeenCalledTimes(3);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'size');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'size');
      expect(getMeta).toHaveBeenNthCalledWith(3, 'size');
    });

    it('should apply last values on report as a string that fails', async (): Promise<void> => {
      const getMeta = jest.fn().mockReturnValue({
        thresholdLimit: 'upper',
        thresholdType: 'number',
      });
      const fire = jest.fn().mockResolvedValue({
        rets: [
          {
            report: JSON.stringify({
              data: [
                {
                  data: [
                    {
                      label: 'Foo',
                      rawLabel: 'Foo',
                      rawValue: 2,
                      success: true,
                      type: 'size',
                      value: '2',
                    },
                  ],
                  label: 'Foo',
                  rawLabel: 'Foo',
                  success: true,
                  type: 'size',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'size',
            }),
          },
        ],
      });

      const contextMock: unknown = {
        event: {
          fire,
        },
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 10,
                success: true,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, context }, config, report);

      expect(report).toEqual({
        data: [
          {
            data: [
              {
                label: 'Foo',
                lastValue: '2',
                lastValueChange: 80,
                lastValueDiff: 8,
                rawLabel: 'Foo',
                rawLastValue: 2,
                rawValue: 10,
                success: false,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: false,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: false,
        type: 'size',
      });

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(getMeta).toHaveBeenCalledTimes(3);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'size');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'size');
      expect(getMeta).toHaveBeenNthCalledWith(3, 'size');
    });

    it('should handle unknown threshold type', async (): Promise<void> => {
      const getMeta = jest.fn().mockReturnValue(undefined);
      const fire = jest.fn().mockResolvedValue({
        rets: [
          {
            report: JSON.stringify({
              data: [
                {
                  data: [
                    {
                      label: 'Foo',
                      rawLabel: 'Foo',
                      rawValue: 2,
                      success: true,
                      type: 'size',
                      value: '2',
                    },
                  ],
                  label: 'Foo',
                  rawLabel: 'Foo',
                  success: true,
                  type: 'size',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'size',
            }),
          },
        ],
      });

      const contextMock: unknown = {
        event: {
          fire,
        },
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 10,
                success: true,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, context }, config, report);

      expect(report).toEqual({
        data: [
          {
            data: [
              {
                label: 'Foo',
                lastValue: '2',
                rawLabel: 'Foo',
                rawLastValue: 2,
                rawValue: 10,
                success: true,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'size',
      });

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(getMeta).toHaveBeenCalledTimes(2);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'size');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'size');
    });

    it('should allow threshold breach failure', async (): Promise<void> => {
      const getMeta = jest.fn().mockReturnValue({
        thresholdLimit: 'upper',
        thresholdType: 'number',
      });
      const fire = jest.fn().mockResolvedValue({
        rets: [
          {
            report: JSON.stringify({
              data: [
                {
                  data: [
                    {
                      label: 'Foo',
                      rawLabel: 'Foo',
                      rawValue: 2,
                      success: true,
                      type: 'size',
                      value: '2',
                    },
                  ],
                  label: 'Foo',
                  rawLabel: 'Foo',
                  success: true,
                  type: 'size',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'size',
            }),
          },
        ],
      });

      const contextMock: unknown = {
        event: {
          fire,
        },
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 10,
                success: true,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'size',
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

      const { getLastReport } = await import('./storage');

      await getLastReport(
        'command/size',
        {
          ...pluginOptions,
          context,
        },
        config,
        report,
      );

      expect(report).toEqual({
        data: [
          {
            data: [
              {
                label: 'Foo',
                lastValue: '2',
                lastValueChange: 80,
                lastValueDiff: 8,
                rawLabel: 'Foo',
                rawLastValue: 2,
                rawValue: 10,
                success: true,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'size',
      });

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(getMeta).toHaveBeenCalledTimes(1);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'size');
    });
  });

  describe('saveReport', (): void => {
    it('should save successful report', async (): Promise<void> => {
      const fire = jest.fn();

      const contextMock: unknown = {
        event: {
          fire,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 10,
                success: true,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, context);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/save', {
        command: 'size',
        report: {
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 10,
                  success: true,
                  type: 'size',
                  value: '10',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'size',
            },
          ],
          label: 'Foo',
          rawLabel: 'Foo',
          success: true,
          type: 'size',
        },
      });
    });

    it('should not save failed report', async (): Promise<void> => {
      const fire = jest.fn();

      const contextMock: unknown = {
        event: {
          fire,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 10,
                success: false,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: false,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: false,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: true,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, context);

      expect(fire).not.toHaveBeenCalled();
    });

    it('should save failed report', async (): Promise<void> => {
      const fire = jest.fn();

      const contextMock: unknown = {
        event: {
          fire,
        },
      };
      const context = contextMock as Context;

      const report = {
        data: [
          {
            data: [
              {
                label: 'Foo',
                rawLabel: 'Foo',
                rawValue: 10,
                success: false,
                type: 'size',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: false,
            type: 'size',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: false,
        type: 'size',
      };
      const config = {
        failOnBreach: true,
        saveOnlyOnSuccess: false,
        thresholds: {
          diffPercentage: 50,
          number: 1,
          percentage: 1,
          size: 1,
        },
      };

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, context);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/save', {
        command: 'size',
        report: {
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 10,
                  success: false,
                  type: 'size',
                  value: '10',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: false,
              type: 'size',
            },
          ],
          label: 'Foo',
          rawLabel: 'Foo',
          success: false,
          type: 'size',
        },
      });
    });
  });
});
