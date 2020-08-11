import { Context } from '@/typings/context';
import { Meta } from '@/typings/module';
import { Module } from '@/typings/module/registry';

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-axe', (): void => {
  it('should register module', async (): Promise<void> => {
    const register = jest.fn();

    const contextMock: unknown = {
      module: {
        register,
      },
    };
    const context = contextMock as Context;

    const { default: Axe } = await import('./index');

    await Axe(
      {
        context,
        dir: 'foo',
      },
      {
        showSuccesses: false,
        thresholds: {
          impact: 'serious',
        },
      },
    );

    expect(register).toHaveBeenCalledWith(
      'axe',
      {
        capabilities: { browser: true, remote: true },
        thresholdLimit: 'upper',
        thresholdType: 'number',
      },
      expect.any(Function),
    );
  });

  it('should execute module', async (): Promise<void> => {
    const close = jest.fn().mockResolvedValue(true);
    const goto = jest.fn().mockResolvedValue(true);
    const setBypassCSP = jest.fn().mockResolvedValue(true);
    const newPage = jest.fn().mockResolvedValue({
      close,
      goto,
      setBypassCSP,
    });
    const chrome = { newPage };

    const analyze = jest.fn().mockResolvedValue({
      passes: [
        {
          description: 'foo description',
          help: 'should foo it',
          helpUrl: 'https://example.com/foo-help',
          id: 'foo',
          impact: undefined,
          tags: [],
          nodes: [],
        },
      ],
      violations: [
        {
          description: 'bar description',
          help: 'should bar it',
          helpUrl: 'https://example.com/bar-help',
          id: 'bar',
          impact: 'moderate',
          tags: [],
          nodes: [],
        },
      ],
    });

    const disableRules = jest.fn();
    const exclude = jest.fn();
    const include = jest.fn();
    const withRules = jest.fn();
    const withTags = jest.fn();

    const register = jest.fn().mockImplementationOnce(
      async (type: string, meta: Meta, cb: Module): Promise<void> => {
        const contextMock: unknown = {};
        const context = contextMock as Context;

        expect(type).toBe('axe');
        expect(meta).toEqual({
          capabilities: { browser: true, remote: true },
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });

        const ret = await cb({
          chrome,
          context,
          url: 'https://example.com',
        });

        expect(ret).toEqual({
          data: [
            {
              data: [
                {
                  label: 'bar',
                  rawLabel: 'bar',
                  rawThreshold: 'none',
                  rawValue: 'moderate',
                  success: false,
                  threshold: 'none',
                  thresholdLimit: 'upper',
                  type: 'axe',
                  value: 'moderate',
                },
                {
                  label: 'foo',
                  rawLabel: 'foo',
                  rawThreshold: 'none',
                  rawValue: undefined,
                  success: true,
                  threshold: 'none',
                  thresholdLimit: 'upper',
                  type: 'axe',
                  value: 'none',
                },
              ],
              label: 'Axe Audits',
              rawLabel: 'Axe Audits',
              success: false,
              type: 'axe',
            },
          ],
          raw: {
            passes: [
              {
                description: 'foo description',
                help: 'should foo it',
                helpUrl: 'https://example.com/foo-help',
                id: 'foo',
                impact: undefined,
                tags: [],
                nodes: [],
              },
            ],
            violations: [
              {
                description: 'bar description',
                help: 'should bar it',
                helpUrl: 'https://example.com/bar-help',
                id: 'bar',
                impact: 'moderate',
                tags: [],
                nodes: [],
              },
            ],
          },
          success: false,
        });

        expect(newPage).toHaveBeenCalledWith();
        expect(close).toHaveBeenCalledWith();
        expect(goto).toHaveBeenCalledWith('https://example.com');
        expect(setBypassCSP).toHaveBeenCalledWith(true);

        expect(analyze).toHaveBeenCalledWith();
        expect(disableRules).not.toHaveBeenCalled();
        expect(exclude).not.toHaveBeenCalled();
        expect(include).not.toHaveBeenCalled();
        expect(withRules).not.toHaveBeenCalled();
        expect(withTags).not.toHaveBeenCalled();
      },
    );

    const contextMock: unknown = {
      event: {
        on(): void {},
      },
      module: {
        register,
      },
    };
    const context = contextMock as Context;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    function AxePuppeteer(): any {}

    Object.assign(AxePuppeteer.prototype, {
      analyze,
      disableRules,
      exclude,
      include,
      withRules,
      withTags,
    });

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('axe-puppeteer', (): any => ({
      AxePuppeteer,
    }));

    const { default: Axe } = await import('./index');

    await Axe(
      {
        context,
        dir: 'foo',
      },
      {
        showSuccesses: true,
        thresholds: {
          impact: 'minor',
        },
      },
    );

    expect(register).toHaveBeenCalledWith(
      'axe',
      {
        capabilities: { browser: true, remote: true },
        thresholdLimit: 'upper',
        thresholdType: 'number',
      },
      expect.any(Function),
    );
  });

  it('should execute module with configs', async (): Promise<void> => {
    const close = jest.fn().mockResolvedValue(true);
    const goto = jest.fn().mockResolvedValue(true);
    const setBypassCSP = jest.fn().mockResolvedValue(true);
    const newPage = jest.fn().mockResolvedValue({
      close,
      goto,
      setBypassCSP,
    });
    const chrome = { newPage };

    const analyze = jest.fn().mockResolvedValue({
      passes: [
        {
          description: 'foo description',
          help: 'should foo it',
          helpUrl: 'https://example.com/foo-help',
          id: 'foo',
          impact: undefined,
          tags: [],
          nodes: [],
        },
      ],
      violations: [
        {
          description: 'bar description',
          help: 'should bar it',
          helpUrl: 'https://example.com/bar-help',
          id: 'bar',
          impact: 'moderate',
          tags: [],
          nodes: [],
        },
      ],
    });

    const disableRules = jest.fn();
    const exclude = jest.fn();
    const include = jest.fn();
    const withRules = jest.fn();
    const withTags = jest.fn();

    const register = jest.fn().mockImplementationOnce(
      async (type: string, meta: Meta, cb: Module): Promise<void> => {
        const contextMock: unknown = {};
        const context = contextMock as Context;

        expect(type).toBe('axe');
        expect(meta).toEqual({
          capabilities: { browser: true, remote: true },
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });

        const ret = await cb({
          chrome,
          context,
          url: 'https://example.com',
        });

        expect(ret).toEqual({
          data: [
            {
              data: [
                {
                  label: 'bar',
                  rawLabel: 'bar',
                  rawThreshold: 'serious',
                  rawValue: 'moderate',
                  success: true,
                  threshold: 'serious',
                  thresholdLimit: 'upper',
                  type: 'axe',
                  value: 'moderate',
                },
                {
                  label: 'foo',
                  rawLabel: 'foo',
                  rawThreshold: 'none',
                  rawValue: undefined,
                  success: true,
                  threshold: 'none',
                  thresholdLimit: 'upper',
                  type: 'axe',
                  value: 'none',
                },
              ],
              label: 'Axe Audits',
              rawLabel: 'Axe Audits',
              success: true,
              type: 'axe',
            },
          ],
          raw: {
            passes: [
              {
                description: 'foo description',
                help: 'should foo it',
                helpUrl: 'https://example.com/foo-help',
                id: 'foo',
                impact: undefined,
                tags: [],
                nodes: [],
              },
            ],
            violations: [
              {
                description: 'bar description',
                help: 'should bar it',
                helpUrl: 'https://example.com/bar-help',
                id: 'bar',
                impact: 'moderate',
                tags: [],
                nodes: [],
              },
            ],
          },
          success: true,
        });

        expect(newPage).toHaveBeenCalledWith();
        expect(close).toHaveBeenCalledWith();
        expect(goto).toHaveBeenCalledWith('https://example.com');
        expect(setBypassCSP).toHaveBeenCalledWith(true);

        expect(analyze).toHaveBeenCalledWith();
        expect(disableRules).toHaveBeenCalledWith('rule-1');
        expect(exclude).toHaveBeenCalledWith(['.a', '.b > c']);
        expect(include).toHaveBeenCalledWith('#z');
        expect(withRules).toHaveBeenCalledWith(['rule-2']);
        expect(withTags).toHaveBeenCalledWith(['blah']);
      },
    );

    const contextMock: unknown = {
      event: {
        on(): void {},
      },
      module: {
        register,
      },
    };
    const context = contextMock as Context;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    function AxePuppeteer(): any {}

    Object.assign(AxePuppeteer.prototype, {
      analyze,
      disableRules,
      exclude,
      include,
      withRules,
      withTags,
    });

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('axe-puppeteer', (): any => ({
      AxePuppeteer,
    }));

    const { default: Axe } = await import('./index');

    await Axe(
      {
        context,
        dir: 'foo',
      },
      {
        disabledRules: 'rule-1',
        exclude: ['.a', '.b > c'],
        include: '#z',
        rules: ['rule-2'],
        showSuccesses: false,
        tags: ['blah'],
        thresholds: {
          foo: 'none',
          bar: 3,
          impact: 3,
        },
      },
    );

    expect(register).toHaveBeenCalledWith(
      'axe',
      {
        capabilities: { browser: true, remote: true },
        thresholdLimit: 'upper',
        thresholdType: 'number',
      },
      expect.any(Function),
    );
  });

  it('should handle error on opening new page', async (): Promise<void> => {
    const newPage = jest.fn().mockResolvedValue(null);
    const chrome = { newPage };

    const register = jest.fn().mockImplementationOnce(
      async (type: string, meta: Meta, cb: Module): Promise<void> => {
        const contextMock: unknown = {};
        const context = contextMock as Context;

        expect(type).toBe('axe');

        expect(meta).toEqual({
          capabilities: { browser: true, remote: true },
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });

        const check = cb({
          chrome,
          context,
          url: 'http://example.com',
        });

        await expect(check).rejects.toThrow(new Error('Could not open page to analyze with axe'));

        expect(newPage).toHaveBeenCalledWith();
      },
    );

    const contextMock: unknown = {
      event: {
        on(): void {},
      },
      module: {
        register,
      },
    };
    const context = contextMock as Context;

    const { default: Axe } = await import('./index');

    await Axe(
      {
        context,
        dir: 'foo',
      },
      {
        showSuccesses: true,
        thresholds: {
          impact: 'minor',
        },
      },
    );

    expect(register).toHaveBeenCalledWith(
      'axe',
      {
        capabilities: { browser: true, remote: true },
        thresholdLimit: 'upper',
        thresholdType: 'number',
      },
      expect.any(Function),
    );
  });
});
