import { PluginOptions } from '@/typings/config/plugin';
import { Emitter } from '@/typings/event';

const pluginOptions: PluginOptions = {
  bus(): void {},
  dir: 'foo',
};

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-last-value/storage', (): void => {
  describe('getLastReport', (): void => {
    it('should handle no last report', async (): Promise<void> => {
      const report = { success: true };
      const fire = jest.fn().mockResolvedValue({ rets: [] });
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({}),
      });

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, bus }, config, report, EventEmitter);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(bus).not.toHaveBeenCalled();
    });

    it('should handle no child data', async (): Promise<void> => {
      const report = { success: true };
      const fire = jest.fn().mockResolvedValue({
        rets: [{ report: {} }],
      });
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({}),
      });

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, bus }, config, report, EventEmitter);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(bus).not.toHaveBeenCalled();
    });

    it('should handle no parent data', async (): Promise<void> => {
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({}),
      });

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, bus }, config, report, EventEmitter);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(bus).not.toHaveBeenCalled();
    });

    it('should handle no matched child data', async (): Promise<void> => {
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({}),
      });

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, bus }, config, report, EventEmitter);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(bus).not.toHaveBeenCalled();
    });

    it('should handle not changing success', async (): Promise<void> => {
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({}),
      });

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, bus }, config, report, EventEmitter);

      expect(fire).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });

      expect(bus.mock.calls).toEqual([['module/registry'], ['module/registry'], ['module/registry']]);
    });

    it('should apply last values on report', async (): Promise<void> => {
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        }),
      });

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, bus }, config, report, EventEmitter);

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

      expect(bus.mock.calls).toEqual([['module/registry'], ['module/registry'], ['module/registry']]);
    });

    it('should apply last values on report as a string that fails', async (): Promise<void> => {
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        }),
      });

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, bus }, config, report, EventEmitter);

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

      expect(bus.mock.calls).toEqual([['module/registry'], ['module/registry'], ['module/registry']]);
    });

    it('should handle unknown threshold type', async (): Promise<void> => {
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        getMeta: (): void => undefined,
      });

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', { ...pluginOptions, bus }, config, report, EventEmitter);

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

      expect(bus.mock.calls).toEqual([['module/registry'], ['module/registry']]);
    });

    it('should allow threshold breach failure', async (): Promise<void> => {
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

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const bus = jest.fn().mockResolvedValue({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        }),
      });

      const { getLastReport } = await import('./storage');

      await getLastReport(
        'command/size',
        {
          ...pluginOptions,
          bus,
        },
        config,
        report,
        EventEmitter,
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

      expect(bus).toHaveBeenCalledWith('module/registry');
    });
  });

  describe('saveReport', (): void => {
    it('should save successful report', async (): Promise<void> => {
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

      const fire = jest.fn();

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, EventEmitter);

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

      const fire = jest.fn();

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, EventEmitter);

      expect(fire).not.toHaveBeenCalled();
    });

    it('should save failed report', async (): Promise<void> => {
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

      const fire = jest.fn();

      const EventEmitter: Emitter = {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        on(): any {},
        fire,
      };

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, EventEmitter);

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
