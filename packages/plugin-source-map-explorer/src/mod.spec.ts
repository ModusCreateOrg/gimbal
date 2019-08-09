import { PluginOptions } from '@/typings/config/plugin';

const pluginOptions: PluginOptions = {
  bus: (): string => '',
  dir: 'foo',
};

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-source-map-explorer/mod', (): void => {
  describe('getThreshold', (): void => {
    it('should handle a bundleConfig as a string', async (): Promise<void> => {
      const { getThreshold } = await import('./mod');

      const ret = getThreshold('foo', 'bar');

      expect(ret).toBeUndefined();
    });

    it('should find a threshold', async (): Promise<void> => {
      const { getThreshold } = await import('./mod');

      const ret = getThreshold('foo.js', {
        path: 'some-bundle.js',
        thresholds: {
          'foo.js': '1 KB',
        },
      });

      expect(ret).toBe('1 KB');
    });

    it('should find a threshold via glob', async (): Promise<void> => {
      const { getThreshold } = await import('./mod');

      const ret = getThreshold('foo/bar/baz.js', {
        path: 'some-bundle.js',
        thresholds: {
          'foo/**/*.js': '10 KB',
        },
      });

      expect(ret).toBe('10 KB');
    });

    it('should not find a threshold', async (): Promise<void> => {
      const { getThreshold } = await import('./mod');

      const ret = getThreshold('foo.js', {
        path: 'some-bundle.js',
        thresholds: {
          'foo/**/*.js': '10 KB',
        },
      });

      expect(ret).toBeUndefined();
    });
  });

  describe('parseBundle', (): void => {
    it('should parse sme report with bundle config as a string', async (): Promise<void> => {
      const { parseBundle } = await import('./mod');

      const ret = parseBundle(
        {
          bundle: 'some-bundle.js',
          bundles: [
            {
              bundleName: 'some-bundle.js',
              totalBytes: 22222,
              unmappedBytes: 0,
              files: {
                'foo.js': 1234,
              },
            },
          ],
          errors: [],
        },
        'some-bundle.js',
      );

      expect(ret).toEqual({
        data: [
          {
            label: 'foo.js',
            rawLabel: 'foo.js',
            rawThreshold: undefined,
            rawValue: 1234,
            success: true,
            threshold: undefined,
            type: 'source-map-explorer',
            value: '1.21 KB',
          },
        ],
        label: 'some-bundle.js',
        rawLabel: 'some-bundle.js',
        success: true,
        type: 'source-map-explorer',
      });
    });

    it('should parse sme report with bundle config as an object', async (): Promise<void> => {
      const { parseBundle } = await import('./mod');

      const ret = parseBundle(
        {
          bundle: 'some-bundle.js',
          bundles: [
            {
              bundleName: 'some-bundle.js',
              totalBytes: 22222,
              unmappedBytes: 0,
              files: {
                'foo.js': 1234,
              },
            },
          ],
          errors: [],
        },
        {
          path: 'some-bundle.js',
          thresholds: {
            'foo.js': '1.5 KB',
          },
        },
      );

      expect(ret).toEqual({
        data: [
          {
            label: 'foo.js',
            rawLabel: 'foo.js',
            rawThreshold: 1536,
            rawValue: 1234,
            success: true,
            threshold: '1.5 KB',
            type: 'source-map-explorer',
            value: '1.21 KB',
          },
        ],
        label: 'some-bundle.js',
        rawLabel: 'some-bundle.js',
        success: true,
        type: 'source-map-explorer',
      });
    });

    it('should parse sme report with a failed threshold', async (): Promise<void> => {
      const { parseBundle } = await import('./mod');

      const ret = parseBundle(
        {
          bundle: 'some-bundle.js',
          bundles: [
            {
              bundleName: 'some-bundle.js',
              totalBytes: 22222,
              unmappedBytes: 0,
              files: {
                'foo.js': 1234,
              },
            },
          ],
          errors: [],
        },
        {
          path: 'some-bundle.js',
          thresholds: {
            'foo.js': '1 KB',
          },
        },
      );

      expect(ret).toEqual({
        data: [
          {
            label: 'foo.js',
            rawLabel: 'foo.js',
            rawThreshold: 1024,
            rawValue: 1234,
            success: false,
            threshold: '1 KB',
            type: 'source-map-explorer',
            value: '1.21 KB',
          },
        ],
        label: 'some-bundle.js',
        rawLabel: 'some-bundle.js',
        success: false,
        type: 'source-map-explorer',
      });
    });
  });

  describe('registerModule', (): void => {
    it('should register module', async (): Promise<void> => {
      const register = jest.fn();
      const bus = jest.fn().mockResolvedValue({
        register,
      });

      const { registerModule } = await import('./mod');

      await registerModule(
        {
          ...pluginOptions,
          bus,
        },
        {
          bundles: [],
        },
      );

      expect(bus).toHaveBeenCalledWith('module/registry');

      expect(register).toHaveBeenCalledWith(
        'source-map-explorer',
        { maxNumRoutes: 1, thresholdLimit: 'upper', thresholdType: 'size' },
        expect.any(Function),
      );
    });
  });

  describe('runModule', (): void => {
    it('should run the module', async (): Promise<void> => {
      const globby = jest
        .fn()
        .mockResolvedValue(['/foo/bar/baz/some-bundle.js', '/foo/bar/baz/js/just-another-bundle.js']);
      const explore = jest
        .fn()
        .mockResolvedValueOnce({
          bundle: '/foo/bar/baz/some-bundle.js',
          bundles: [
            {
              bundleName: '/foo/bar/baz/some-bundle.js',
              totalBytes: 22222,
              unmappedBytes: 0,
              files: {
                'foo.js': 1234,
              },
            },
          ],
          errors: [],
        })
        .mockResolvedValueOnce({
          bundle: '/foo/bar/baz/js/just-another-bundle.js',
          bundles: [
            {
              bundleName: '/foo/bar/baz/js/just-another-bundle.js',
              totalBytes: 22222,
              unmappedBytes: 0,
              files: {
                'bar.js': 1234,
              },
            },
          ],
          errors: [],
        });

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('globby', (): any => globby);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('source-map-explorer', (): any => explore);

      const { runModule } = await import('./mod');

      const fn = runModule({
        bundles: [
          {
            path: '**/*.js',
            thresholds: {
              'bar.js': '1.5 KB',
              'foo.js': '1 KB',
            },
          },
        ],
      });

      const ret = await fn({
        commandOptions: {
          buildDir: 'baz',
          comment: true,
          cwd: '/foo/bar',
          verbose: false,
        },
      });

      expect(ret).toEqual({
        data: [
          {
            data: [
              {
                data: [
                  {
                    label: 'foo.js',
                    rawLabel: 'foo.js',
                    rawThreshold: 1024,
                    rawValue: 1234,
                    success: false,
                    threshold: '1 KB',
                    type: 'source-map-explorer',
                    value: '1.21 KB',
                  },
                ],
                label: '/foo/bar/baz/some-bundle.js',
                rawLabel: '/foo/bar/baz/some-bundle.js',
                success: false,
                type: 'source-map-explorer',
              },
              {
                data: [
                  {
                    label: 'bar.js',
                    rawLabel: 'bar.js',
                    rawThreshold: 1536,
                    rawValue: 1234,
                    success: true,
                    threshold: '1.5 KB',
                    type: 'source-map-explorer',
                    value: '1.21 KB',
                  },
                ],
                label: '/foo/bar/baz/js/just-another-bundle.js',
                rawLabel: '/foo/bar/baz/js/just-another-bundle.js',
                success: true,
                type: 'source-map-explorer',
              },
            ],
            label: 'Source Map Explorer Audits',
            rawLabel: 'Source Map Explorer Audits',
            success: false,
            type: 'source-map-explorer',
          },
        ],
        raw: [
          {
            bundle: '/foo/bar/baz/some-bundle.js',
            bundles: [
              {
                bundleName: '/foo/bar/baz/some-bundle.js',
                totalBytes: 22222,
                unmappedBytes: 0,
                files: {
                  'foo.js': 1234,
                },
              },
            ],
            errors: [],
          },
          {
            bundle: '/foo/bar/baz/js/just-another-bundle.js',
            bundles: [
              {
                bundleName: '/foo/bar/baz/js/just-another-bundle.js',
                totalBytes: 22222,
                unmappedBytes: 0,
                files: {
                  'bar.js': 1234,
                },
              },
            ],
            errors: [],
          },
        ],
        success: false,
      });

      expect(globby).toHaveBeenCalledWith(['/foo/bar/baz/**/*.js']);

      expect(explore.mock.calls).toEqual([['/foo/bar/baz/some-bundle.js'], ['/foo/bar/baz/js/just-another-bundle.js']]);
    });

    it('should run the module with a failure', async (): Promise<void> => {
      const globby = jest
        .fn()
        .mockResolvedValue([
          '/foo/bar/baz/foo-bundle.js',
          '/foo/bar/baz/some-bundle.js',
          '/foo/bar/baz/js/just-another-bundle.js',
        ]);
      const explore = jest
        .fn()
        .mockResolvedValueOnce({
          bundle: '/foo/bar/baz/foo-bundle.js',
          bundles: [
            {
              bundleName: '/foo/bar/baz/foo-bundle.js',
              totalBytes: 22222,
              unmappedBytes: 0,
              files: {
                'foo.js': 1234,
              },
            },
          ],
          errors: [],
        })
        .mockResolvedValueOnce({
          bundle: '/foo/bar/baz/some-bundle.js',
          bundles: [
            {
              bundleName: '/foo/bar/baz/some-bundle.js',
              totalBytes: 22222,
              unmappedBytes: 0,
              files: {
                'bar.js': 1234,
                'foo.js': 1234,
              },
            },
          ],
          errors: [],
        })
        .mockRejectedValueOnce(new Error('foo'));

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('globby', (): any => globby);

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      jest.doMock('source-map-explorer', (): any => explore);

      const { runModule } = await import('./mod');

      const fn = runModule({
        bundles: [
          'foo-bundle.js',
          {
            path: '**/*.js',
            thresholds: {
              'bar.js': '1 KB',
              'foo.js': '1.5 KB',
            },
          },
          '!not-this.js',
        ],
      });

      const ret = await fn({
        commandOptions: {
          buildDir: 'baz',
          comment: true,
          cwd: '/foo/bar',
          verbose: false,
        },
      });

      expect(ret).toEqual({
        data: [
          {
            data: [
              {
                data: [
                  {
                    label: 'foo.js',
                    rawLabel: 'foo.js',
                    rawThreshold: undefined,
                    rawValue: 1234,
                    success: true,
                    threshold: undefined,
                    type: 'source-map-explorer',
                    value: '1.21 KB',
                  },
                ],
                label: '/foo/bar/baz/foo-bundle.js',
                rawLabel: '/foo/bar/baz/foo-bundle.js',
                success: true,
                type: 'source-map-explorer',
              },
              {
                data: [
                  {
                    label: 'bar.js',
                    rawLabel: 'bar.js',
                    rawThreshold: 1024,
                    rawValue: 1234,
                    success: false,
                    threshold: '1 KB',
                    type: 'source-map-explorer',
                    value: '1.21 KB',
                  },
                  {
                    label: 'foo.js',
                    rawLabel: 'foo.js',
                    rawThreshold: 1536,
                    rawValue: 1234,
                    success: true,
                    threshold: '1.5 KB',
                    type: 'source-map-explorer',
                    value: '1.21 KB',
                  },
                ],
                label: '/foo/bar/baz/some-bundle.js',
                rawLabel: '/foo/bar/baz/some-bundle.js',
                success: false,
                type: 'source-map-explorer',
              },
            ],
            label: 'Source Map Explorer Audits',
            rawLabel: 'Source Map Explorer Audits',
            success: false,
            type: 'source-map-explorer',
          },
        ],
        raw: [
          {
            bundle: '/foo/bar/baz/foo-bundle.js',
            bundles: [
              {
                bundleName: '/foo/bar/baz/foo-bundle.js',
                totalBytes: 22222,
                unmappedBytes: 0,
                files: {
                  'foo.js': 1234,
                },
              },
            ],
            errors: [],
          },
          {
            bundle: '/foo/bar/baz/some-bundle.js',
            bundles: [
              {
                bundleName: '/foo/bar/baz/some-bundle.js',
                totalBytes: 22222,
                unmappedBytes: 0,
                files: {
                  'bar.js': 1234,
                  'foo.js': 1234,
                },
              },
            ],
            errors: [],
          },
          false,
        ],
        success: false,
      });

      expect(globby).toHaveBeenCalledWith([
        '/foo/bar/baz/foo-bundle.js',
        '/foo/bar/baz/**/*.js',
        '!/foo/bar/baz/not-this.js',
      ]);

      expect(explore.mock.calls).toEqual([
        ['/foo/bar/baz/foo-bundle.js'],
        ['/foo/bar/baz/some-bundle.js'],
        ['/foo/bar/baz/js/just-another-bundle.js'],
      ]);
    });
  });
});
