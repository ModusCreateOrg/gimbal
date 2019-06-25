import Emitter from '@modus/gimbal-core/lib/event';
import { getLastReport, saveReport } from './storage';

describe('@modus/gimbal-plugin-last-value/storage', (): void => {
  describe('getLastReport', (): void => {
    it('should handle no last report', async (): Promise<void> => {
      const report = { success: true };
      const getEvent = jest.fn().mockResolvedValue(null);
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
    });

    it('should handle no child data', async (): Promise<void> => {
      const report = { success: true };
      const getEvent = jest.fn().mockResolvedValue({
        report: {},
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
    });

    it('should handle no parent data', async (): Promise<void> => {
      const report = {
        data: [
          {
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        success: true,
        type: 'foo',
      };
      const getEvent = jest.fn().mockResolvedValue({
        report: {
          data: [
            {
              data: [
                {
                  label: 'Bar',
                  rawLabel: 'Bar',
                  rawValue: 3,
                  success: true,
                  type: 'foo',
                  value: '3',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'foo',
            },
          ],
          success: true,
          type: 'foo',
        },
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
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
                type: 'foo',
                value: '3',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        success: true,
        type: 'foo',
      };
      const getEvent = jest.fn().mockResolvedValue({
        report: {
          data: [
            {
              data: [
                {
                  label: 'Bar',
                  rawLabel: 'Bar',
                  rawValue: 3,
                  success: true,
                  type: 'foo',
                  value: '3',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'foo',
            },
          ],
          success: true,
          type: 'foo',
        },
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: false,
            type: 'foo',
          },
        ],
        success: false,
        type: 'foo',
      };
      const getEvent = jest.fn().mockResolvedValue({
        report: {
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 3,
                  success: true,
                  type: 'foo',
                  value: '3',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'foo',
            },
          ],
          success: true,
          type: 'foo',
        },
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
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
                type: 'foo',
                value: '3',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'foo',
      };
      const getEvent = jest.fn().mockResolvedValue({
        report: {
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 2,
                  success: true,
                  type: 'foo',
                  value: '2',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'foo',
            },
          ],
          label: 'Foo',
          rawLabel: 'Foo',
          success: true,
          type: 'foo',
        },
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      });

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
                type: 'foo',
                value: '3',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'foo',
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'foo',
      };
      const getEvent = jest.fn().mockResolvedValue({
        report: JSON.stringify({
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 2,
                  success: true,
                  type: 'foo',
                  value: '2',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'foo',
            },
          ],
          label: 'Foo',
          rawLabel: 'Foo',
          success: true,
          type: 'foo',
        }),
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      });

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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: false,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: false,
        type: 'foo',
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'foo',
      };
      const getEvent = jest.fn().mockResolvedValue({
        report: JSON.stringify({
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 2,
                  success: true,
                  type: 'foo',
                  value: '2',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'foo',
            },
          ],
          label: 'Foo',
          rawLabel: 'Foo',
          success: true,
          type: 'foo',
        }),
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
        },
      });

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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'foo',
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'foo',
      };
      const getEvent = jest.fn().mockResolvedValue({
        report: JSON.stringify({
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 2,
                  success: true,
                  type: 'foo',
                  value: '2',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'foo',
            },
          ],
          label: 'Foo',
          rawLabel: 'Foo',
          success: true,
          type: 'foo',
        }),
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

      const listener = Emitter.on('plugin/last-value/report/get', getEvent);

      await getLastReport('foo/bar', config, report, Emitter, {
        foo: {
          thresholdLimit: 'upper',
          thresholdType: 'number',
        },
      });

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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'foo',
      });

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'bar',
      });

      Emitter.un('plugin/last-value/report/get', listener);
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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: true,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: true,
        type: 'foo',
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

      const saveEvent = jest.fn().mockResolvedValue('foo');

      const listener = Emitter.on('plugin/last-value/report/save', saveEvent);

      await saveReport('foo/bar', config, report, Emitter);

      expect(saveEvent).toHaveBeenCalledWith('plugin/last-value/report/save', {
        command: 'bar',
        report: {
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 10,
                  success: true,
                  type: 'foo',
                  value: '10',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: true,
              type: 'foo',
            },
          ],
          label: 'Foo',
          rawLabel: 'Foo',
          success: true,
          type: 'foo',
        },
      });

      Emitter.un('plugin/last-value/report/save', listener);
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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: false,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: false,
        type: 'foo',
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

      const saveEvent = jest.fn().mockResolvedValue('foo');

      const listener = Emitter.on('plugin/last-value/report/save', saveEvent);

      await saveReport('foo/bar', config, report, Emitter);

      expect(saveEvent).not.toHaveBeenCalled();

      Emitter.un('plugin/last-value/report/save', listener);
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
                type: 'foo',
                value: '10',
              },
            ],
            label: 'Foo',
            rawLabel: 'Foo',
            success: false,
            type: 'foo',
          },
        ],
        label: 'Foo',
        rawLabel: 'Foo',
        success: false,
        type: 'foo',
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

      const saveEvent = jest.fn().mockResolvedValue('foo');

      const listener = Emitter.on('plugin/last-value/report/save', saveEvent);

      await saveReport('foo/bar', config, report, Emitter);

      expect(saveEvent).toHaveBeenCalledWith('plugin/last-value/report/save', {
        command: 'bar',
        report: {
          data: [
            {
              data: [
                {
                  label: 'Foo',
                  rawLabel: 'Foo',
                  rawValue: 10,
                  success: false,
                  type: 'foo',
                  value: '10',
                },
              ],
              label: 'Foo',
              rawLabel: 'Foo',
              success: false,
              type: 'foo',
            },
          ],
          label: 'Foo',
          rawLabel: 'Foo',
          success: false,
          type: 'foo',
        },
      });

      Emitter.un('plugin/last-value/report/save', listener);
    });
  });
});
