beforeEach((): void => {
  jest.resetModules();
});

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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        }),
      }));

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

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

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        }),
      }));

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

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

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
        getMeta: (): void => undefined,
      }));

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

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

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/get', getEvent);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getMeta: (): any => ({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        }),
      }));

      const { getLastReport } = await import('./storage');

      await getLastReport('command/size', config, report, Emitter);

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

      expect(getEvent).toHaveBeenCalledWith('plugin/last-value/report/get', {
        command: 'size',
      });
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

      const saveEvent = jest.fn().mockResolvedValue('foo');

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/save', saveEvent);

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, Emitter);

      expect(saveEvent).toHaveBeenCalledWith('plugin/last-value/report/save', {
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

      const saveEvent = jest.fn().mockResolvedValue('foo');

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/save', saveEvent);

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, Emitter);

      expect(saveEvent).not.toHaveBeenCalled();
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

      const saveEvent = jest.fn().mockResolvedValue('foo');

      const { default: Emitter } = await import('@modus/gimbal-core/lib/event');

      Emitter.on('plugin/last-value/report/save', saveEvent);

      const { saveReport } = await import('./storage');

      await saveReport('command/size', config, report, Emitter);

      expect(saveEvent).toHaveBeenCalledWith('plugin/last-value/report/save', {
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
