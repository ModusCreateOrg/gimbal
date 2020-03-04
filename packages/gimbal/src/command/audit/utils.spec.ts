import { Context } from '@/typings/context';

beforeEach((): void => {
  jest.resetModules();
});

describe('gimbal/command/audit/utils', () => {
  describe('addSpinners', () => {
    test('should add spinners for all audits', async (): Promise<void> => {
      const addSpinner = jest.fn();

      jest.doMock('@modus/gimbal-core/lib/logger', () => ({
        addSpinner,
      }));

      const { addSpinners } = await import('./utils');

      addSpinners({
        foo: {
          module: 'foo',
          name: 'foo',
        },
        bar: {
          module: 'bar',
          name: 'bar',
        },
        baz: {
          module: 'baz',
          name: 'baz',
        },
      });

      expect(addSpinner).toHaveBeenCalledTimes(3);

      expect(addSpinner).toHaveBeenNthCalledWith(1, 'foo', '[ foo ]');
      expect(addSpinner).toHaveBeenNthCalledWith(2, 'bar', '[ bar ]');
      expect(addSpinner).toHaveBeenNthCalledWith(3, 'baz', '[ baz ]');
    });

    test('should add spinners for all audits with a route', async (): Promise<void> => {
      const addSpinner = jest.fn();

      jest.doMock('@modus/gimbal-core/lib/logger', () => ({
        addSpinner,
      }));

      const { addSpinners } = await import('./utils');

      addSpinners(
        {
          foo: {
            module: 'foo',
            name: 'foo',
          },
          bar: {
            module: 'bar',
            name: 'bar',
          },
          baz: {
            module: 'baz',
            name: 'baz',
          },
        },
        '/foo',
      );

      expect(addSpinner).toHaveBeenCalledTimes(3);

      expect(addSpinner).toHaveBeenNthCalledWith(1, 'foo', { status: 'spinning', text: '[ foo ] - /foo' });
      expect(addSpinner).toHaveBeenNthCalledWith(2, 'bar', { status: 'spinning', text: '[ bar ] - /foo' });
      expect(addSpinner).toHaveBeenNthCalledWith(3, 'baz', { status: 'spinning', text: '[ baz ] - /foo' });
    });
  });

  describe('didAuditPass', () => {
    test('should return true for a pass', async (): Promise<void> => {
      const report = {
        success: true,
      };

      const { didAuditPass } = await import('./utils');

      const ret = didAuditPass(report);

      expect(ret).toBe(true);
    });

    test('should return false for a failure', async (): Promise<void> => {
      const report = {
        success: false,
      };

      const { didAuditPass } = await import('./utils');

      const ret = didAuditPass(report);

      expect(ret).toBe(false);
    });

    test('should return true if no report', async (): Promise<void> => {
      const { didAuditPass } = await import('./utils');

      const ret = didAuditPass();

      expect(ret).toBe(true);
    });
  });

  describe('findBuildDir', () => {
    test('should find first dir', async (): Promise<void> => {
      const exists = jest.fn().mockResolvedValue(true);
      const resolvePath = jest.fn().mockReturnValue('/foo/build');
      const get = jest.fn().mockReturnValue('/foo');

      jest.doMock('@modus/gimbal-core/lib/utils/fs', () => ({
        exists,
        resolvePath,
      }));

      const contextMock: unknown = {
        config: {
          get,
        },
      };

      const context = contextMock as Context;

      const { findBuildDir } = await import('./utils');

      const buildDir = await findBuildDir(context);

      expect(buildDir).toBe('/foo/build');

      expect(exists).toHaveBeenCalledTimes(1);
      expect(exists).toHaveBeenCalledWith('/foo/build');

      expect(resolvePath).toHaveBeenCalledTimes(1);
      expect(resolvePath).toHaveBeenCalledWith('/foo', 'build');

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('configs.cwd');
    });

    test('should find second dir', async (): Promise<void> => {
      const exists = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
      const resolvePath = jest
        .fn()
        .mockReturnValueOnce('/foo/build')
        .mockReturnValueOnce('/foo/dist');
      const get = jest.fn().mockReturnValue('/foo');

      jest.doMock('@modus/gimbal-core/lib/utils/fs', () => ({
        exists,
        resolvePath,
      }));

      const contextMock: unknown = {
        config: {
          get,
        },
      };

      const context = contextMock as Context;

      const { findBuildDir } = await import('./utils');

      const buildDir = await findBuildDir(context);

      expect(buildDir).toBe('/foo/dist');

      expect(exists).toHaveBeenCalledTimes(2);
      expect(exists).toHaveBeenNthCalledWith(1, '/foo/build');
      expect(exists).toHaveBeenNthCalledWith(2, '/foo/dist');

      expect(resolvePath).toHaveBeenCalledTimes(2);
      expect(resolvePath).toHaveBeenNthCalledWith(1, '/foo', 'build');
      expect(resolvePath).toHaveBeenNthCalledWith(2, '/foo', 'dist');

      expect(get).toHaveBeenCalledTimes(2);
      expect(get).toHaveBeenNthCalledWith(1, 'configs.cwd');
      expect(get).toHaveBeenNthCalledWith(2, 'configs.cwd');
    });

    test('should not find a dir', async (): Promise<void> => {
      const exists = jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false);
      const resolvePath = jest
        .fn()
        .mockReturnValueOnce('/foo/build')
        .mockReturnValueOnce('/foo/dist');
      const get = jest.fn().mockReturnValue('/foo');

      jest.doMock('@modus/gimbal-core/lib/utils/fs', () => ({
        exists,
        resolvePath,
      }));

      const contextMock: unknown = {
        config: {
          get,
        },
      };

      const context = contextMock as Context;

      const { findBuildDir } = await import('./utils');

      const buildDir = await findBuildDir(context);

      expect(buildDir).toBe(undefined);

      expect(exists).toHaveBeenCalledTimes(2);
      expect(exists).toHaveBeenNthCalledWith(1, '/foo/build');
      expect(exists).toHaveBeenNthCalledWith(2, '/foo/dist');

      expect(resolvePath).toHaveBeenCalledTimes(2);
      expect(resolvePath).toHaveBeenNthCalledWith(1, '/foo', 'build');
      expect(resolvePath).toHaveBeenNthCalledWith(2, '/foo', 'dist');

      expect(get).toHaveBeenCalledTimes(2);
      expect(get).toHaveBeenNthCalledWith(1, 'configs.cwd');
      expect(get).toHaveBeenNthCalledWith(2, 'configs.cwd');
    });
  });

  describe('getModulesToRun', () => {
    test('should get the modules to run', async (): Promise<void> => {
      const getMeta = jest
        .fn()
        .mockReturnValueOnce({})
        .mockReturnValueOnce({
          maxNumRoutes: 0,
        })
        .mockReturnValueOnce({
          maxNumRoutes: 1,
        });

      const audits = {
        foo: {
          disabled: true,
          module: 'foo',
          name: 'foo',
        },
        bar: {
          module: 'bar',
          name: 'bar',
        },
        baz: {
          module: 'baz',
          name: 'baz',
        },
      };

      const contextMock: unknown = {
        module: {
          getMeta,
        },
      };

      const context = contextMock as Context;

      const { getModulesToRun } = await import('./utils');

      const ret = getModulesToRun(audits, 0, context);

      expect(ret).toEqual({
        bar: {
          module: 'bar',
          name: 'bar',
        },
        baz: {
          module: 'baz',
          name: 'baz',
        },
      });

      expect(getMeta).toHaveBeenCalledTimes(2);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'bar');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'baz');
    });

    test('should get the modules to run when index is passed some modules', async (): Promise<void> => {
      const getMeta = jest
        .fn()
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce({
          maxNumRoutes: 0,
        })
        .mockReturnValueOnce({
          maxNumRoutes: 1,
        });

      const audits = {
        foo: {
          module: 'foo',
          name: 'foo',
        },
        bar: {
          module: 'bar',
          name: 'bar',
        },
        baz: {
          module: 'baz',
          name: 'baz',
        },
      };

      const contextMock: unknown = {
        module: {
          getMeta,
        },
      };

      const context = contextMock as Context;

      const { getModulesToRun } = await import('./utils');

      const ret = getModulesToRun(audits, 1, context);

      expect(ret).toEqual({
        baz: {
          module: 'baz',
          name: 'baz',
        },
      });

      expect(getMeta).toHaveBeenCalledTimes(3);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'foo');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'bar');
      expect(getMeta).toHaveBeenNthCalledWith(3, 'baz');
    });
  });

  describe('isModuleBrowserable', () => {
    test('should check that there is a browserable module', async (): Promise<void> => {
      const get = jest.fn().mockReturnValue({
        foo: {
          name: 'foo',
        },
      });

      const getMeta = jest.fn().mockReturnValueOnce({
        capabilities: {
          browser: true,
        },
      });

      const contextMock: unknown = {
        config: {
          get,
        },
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const { isModuleBrowserable } = await import('./utils');

      const ret = isModuleBrowserable(context);

      expect(ret).toBe(true);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenNthCalledWith(1, 'audits');

      expect(getMeta).toHaveBeenCalledTimes(1);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'foo');
    });

    test('should check that there is not a browserable module', async (): Promise<void> => {
      const get = jest.fn().mockReturnValue({
        foo: {
          name: 'foo',
        },
        bar: {
          disabled: true,
          name: 'bar',
        },
        baz: {
          name: 'baz',
        },
      });

      const getMeta = jest
        .fn()
        .mockReturnValueOnce({
          capabilities: {
            browser: false,
          },
        })
        .mockReturnValueOnce({
          capabilities: {
            browser: false,
          },
        });

      const contextMock: unknown = {
        config: {
          get,
        },
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const { isModuleBrowserable } = await import('./utils');

      const ret = isModuleBrowserable(context);

      expect(ret).toBe(false);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenNthCalledWith(1, 'audits');

      expect(getMeta).toHaveBeenCalledTimes(2);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'foo');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'baz');
    });
  });

  describe('isRouteLocal', () => {
    test('should check if route is local', async (): Promise<void> => {
      const { isRouteLocal } = await import('./utils');

      const ret = isRouteLocal('/foo');

      expect(ret).toBe(true);
    });

    test('should check if route is remote', async (): Promise<void> => {
      const { isRouteLocal } = await import('./utils');

      const ret = isRouteLocal('https://labs.moduscreate.com/gimbal-web-performance-audit-budgeting');

      expect(ret).toBe(false);
    });
  });

  describe('isRoutesLocal', () => {
    test('should check if a route is local', async (): Promise<void> => {
      const get = jest.fn().mockReturnValue(['/foo', '/', '/foo/bar']);

      const contextMock: unknown = {
        config: {
          get,
        },
      };

      const context = contextMock as Context;

      const { isRoutesLocal } = await import('./utils');

      const ret = isRoutesLocal(context);

      expect(ret).toBe(true);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('configs.route');
    });

    test('should check if a route is local with remote', async (): Promise<void> => {
      const get = jest
        .fn()
        .mockReturnValue(['https://labs.moduscreate.com/gimbal-web-performance-audit-budgeting', '/foo/bar']);

      const contextMock: unknown = {
        config: {
          get,
        },
      };

      const context = contextMock as Context;

      const { isRoutesLocal } = await import('./utils');

      const ret = isRoutesLocal(context);

      expect(ret).toBe(true);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('configs.route');
    });

    test('should not find a local route', async (): Promise<void> => {
      const get = jest
        .fn()
        .mockReturnValue([
          'https://labs.moduscreate.com/gimbal-web-performance-audit-budgeting',
          'https://moduscreate.com',
        ]);

      const contextMock: unknown = {
        config: {
          get,
        },
      };

      const context = contextMock as Context;

      const { isRoutesLocal } = await import('./utils');

      const ret = isRoutesLocal(context);

      expect(ret).toBe(false);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('configs.route');
    });
  });

  describe('normalizeAudits', () => {
    test('should turn array of strings to object', async (): Promise<void> => {
      const audits = ['foo', 'bar', 'baz'];

      const { normalizeAudits } = await import('./utils');

      const ret = normalizeAudits(audits);

      expect(ret).toEqual({
        foo: {
          module: 'foo',
          name: 'foo',
        },
        bar: {
          module: 'bar',
          name: 'bar',
        },
        baz: {
          module: 'baz',
          name: 'baz',
        },
      });
    });

    test('should handle mixed object values', async (): Promise<void> => {
      const audits = {
        foo: true,
        bar: false,
        baz: {
          module: 'baz-mod',
          name: 'bad',
        },
      };

      const { normalizeAudits } = await import('./utils');

      const ret = normalizeAudits(audits);

      expect(ret).toEqual({
        foo: {
          disabled: false,
          module: 'foo',
          name: 'foo',
        },
        bar: {
          disabled: true,
          module: 'bar',
          name: 'bar',
        },
        baz: {
          disabled: false,
          module: 'baz-mod',
          name: 'baz',
        },
      });
    });

    test('should use default audits', async (): Promise<void> => {
      const { normalizeAudits } = await import('./utils');

      const ret = normalizeAudits();

      expect(ret).toEqual({
        'heap-snapshot': {
          disabled: false,
          module: 'heap-snapshot',
          name: 'heap-snapshot',
        },
        lighthouse: {
          disabled: false,
          module: 'lighthouse',
          name: 'lighthouse',
        },
        size: {
          disabled: false,
          module: 'size',
          name: 'size',
        },
        'unused-source': {
          disabled: false,
          module: 'unused-source',
          name: 'unused-source',
        },
      });
    });
  });

  describe('setCapabilities', () => {
    test('should handle if local route', async (): Promise<void> => {
      const getMeta = jest
        .fn()
        .mockReturnValueOnce({
          capabilities: {
            remote: true,
          },
        })
        .mockReturnValueOnce({
          capabilities: {
            remote: false,
          },
        });

      const audits = {
        foo: {
          module: 'foo',
          name: 'foo',
        },
        bar: {
          disabled: true,
          module: 'bar',
          name: 'bar',
        },
        baz: {
          module: 'baz',
          name: 'baz',
        },
      };

      const capabilities = {
        browserable: true,
        hasLocalRoute: true,
      };

      const contextMock: unknown = {
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const { setCapabilities } = await import('./utils');

      const ret = setCapabilities(audits, capabilities, context);

      expect(ret).toEqual({
        foo: {
          disabled: false,
          module: 'foo',
          name: 'foo',
        },
        bar: {
          disabled: true,
          module: 'bar',
          name: 'bar',
        },
        baz: {
          disabled: false,
          module: 'baz',
          name: 'baz',
        },
      });

      expect(getMeta).toHaveBeenCalledTimes(2);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'foo');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'baz');
    });

    test('should handle if no local route', async (): Promise<void> => {
      const getMeta = jest
        .fn()
        .mockReturnValueOnce({
          capabilities: {
            remote: true,
          },
        })
        .mockReturnValueOnce({
          capabilities: {
            remote: false,
          },
        })
        .mockReturnValueOnce(undefined);

      const audits = {
        foo: {
          module: 'foo',
          name: 'foo',
        },
        bar: {
          disabled: true,
          module: 'bar',
          name: 'bar',
        },
        baz: {
          module: 'baz',
          name: 'baz',
        },
        foobar: {
          module: 'foobar',
          name: 'foobar',
        },
      };

      const capabilities = {
        browserable: true,
        hasLocalRoute: false,
      };

      const contextMock: unknown = {
        module: {
          getMeta,
        },
      };
      const context = contextMock as Context;

      const { setCapabilities } = await import('./utils');

      const ret = setCapabilities(audits, capabilities, context);

      expect(ret).toEqual({
        foo: {
          disabled: false,
          module: 'foo',
          name: 'foo',
        },
        bar: {
          disabled: true,
          module: 'bar',
          name: 'bar',
        },
        baz: {
          disabled: true,
          module: 'baz',
          name: 'baz',
        },
        foobar: {
          disabled: true,
          module: 'foobar',
          name: 'foobar',
        },
      });

      expect(getMeta).toHaveBeenCalledTimes(3);
      expect(getMeta).toHaveBeenNthCalledWith(1, 'foo');
      expect(getMeta).toHaveBeenNthCalledWith(2, 'baz');
      expect(getMeta).toHaveBeenNthCalledWith(3, 'foobar');
    });
  });
});
