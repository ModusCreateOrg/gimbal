import realdeepmerge from 'deepmerge';
import { Emitter } from '@/typings/event';
import { Meta } from '@/typings/module';
import { Module } from '@/typings/module/registry';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Deepmerge = (x: any, y: any) => any;

const event: Emitter = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  fire: (): any => {},
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  on: (): any => {},
};

const Command = {};

beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-plugin-axe', (): void => {
  it('should register module', async (): Promise<void> => {
    const deepmergeMock = jest.fn();
    const register = jest.fn();

    jest.doMock(
      'deepmerge',
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (): Deepmerge => (x: any, y: any): any => {
        deepmergeMock(x, y);
        return realdeepmerge(x, y);
      },
    );

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
      register,
    }));

    const { default: Axe } = await import('./index');

    await Axe(
      {
        dir: 'foo',
        event,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        program: Command as any,
        utils: {
          envOrDefault: (): string => 'foo',
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          getOptionsFromCommand: (): any => {},
          resolvePath: (): string => 'foo',
        },
      },
      {
        showSuccesses: false,
        thresholds: {
          impact: 'serious',
        },
      },
    );

    expect(deepmergeMock).toHaveBeenCalledWith(
      {
        showSuccesses: true,
        thresholds: {
          impact: 'none',
        },
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
      { thresholdLimit: 'upper', thresholdType: 'number' },
      expect.any(Function),
    );
  });

  it('should execute module', async (): Promise<void> => {
    const deepmergeMock = jest.fn();
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
        expect(type).toBe('axe');
        expect(meta).toEqual({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });

        const ret = await cb({
          chrome,
          commandOptions: {
            comment: true,
            cwd: __dirname,
            verbose: false,
          },
          url: 'https://example.com',
        });

        expect(ret).toEqual({
          data: [
            {
              data: [
                {
                  label: 'foo',
                  rawLabel: 'foo',
                  rawThreshold: 'minor',
                  rawValue: undefined,
                  success: true,
                  threshold: 'minor',
                  thresholdLimit: 'upper',
                  type: 'axe',
                  value: '',
                },
                {
                  label: 'bar',
                  rawLabel: 'bar',
                  rawThreshold: 'minor',
                  rawValue: 'moderate',
                  success: false,
                  threshold: 'minor',
                  thresholdLimit: 'upper',
                  type: 'axe',
                  value: 'moderate',
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

    jest.doMock(
      'deepmerge',
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (): Deepmerge => (x: any, y: any): any => {
        deepmergeMock(x, y);
        return realdeepmerge(x, y);
      },
    );

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
      register,
    }));

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('axe-puppeteer', (): any => ({
      AxePuppeteer,
    }));

    const { default: Axe } = await import('./index');

    await Axe(
      {
        dir: 'foo',
        event,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        program: Command as any,
        utils: {
          envOrDefault: (): string => 'foo',
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          getOptionsFromCommand: (): any => {},
          resolvePath: (): string => 'foo',
        },
      },
      {
        showSuccesses: true,
        thresholds: {
          impact: 'minor',
        },
      },
    );

    expect(deepmergeMock).toHaveBeenCalledWith(
      {
        showSuccesses: true,
        thresholds: {
          impact: 'none',
        },
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
      { thresholdLimit: 'upper', thresholdType: 'number' },
      expect.any(Function),
    );
  });

  it('should execute module with configs', async (): Promise<void> => {
    const deepmergeMock = jest.fn();
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
        expect(type).toBe('axe');
        expect(meta).toEqual({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });

        const ret = await cb({
          chrome,
          commandOptions: {
            comment: true,
            cwd: __dirname,
            verbose: false,
          },
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

    jest.doMock(
      'deepmerge',
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (): Deepmerge => (x: any, y: any): any => {
        deepmergeMock(x, y);
        return realdeepmerge(x, y);
      },
    );

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
      register,
    }));

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('axe-puppeteer', (): any => ({
      AxePuppeteer,
    }));

    const { default: Axe } = await import('./index');

    await Axe(
      {
        dir: 'foo',
        event,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        program: Command as any,
        utils: {
          envOrDefault: (): string => 'foo',
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          getOptionsFromCommand: (): any => {},
          resolvePath: (): string => 'foo',
        },
      },
      {
        disabledRules: 'rule-1',
        exclude: ['.a', '.b > c'],
        include: '#z',
        rules: ['rule-2'],
        showSuccesses: false,
        tags: ['blah'],
        thresholds: {
          impact: 3,
        },
      },
    );

    expect(deepmergeMock).toHaveBeenCalledWith(
      {
        showSuccesses: true,
        thresholds: {
          impact: 'none',
        },
      },
      {
        disabledRules: 'rule-1',
        exclude: ['.a', '.b > c'],
        include: '#z',
        rules: ['rule-2'],
        showSuccesses: false,
        tags: ['blah'],
        thresholds: {
          impact: 3,
        },
      },
    );

    expect(register).toHaveBeenCalledWith(
      'axe',
      { thresholdLimit: 'upper', thresholdType: 'number' },
      expect.any(Function),
    );
  });

  it('should handle error on opening new page', async (): Promise<void> => {
    const deepmergeMock = jest.fn();
    const newPage = jest.fn().mockResolvedValue(null);
    const chrome = { newPage };

    const register = jest.fn().mockImplementationOnce(
      async (type: string, meta: Meta, cb: Module): Promise<void> => {
        expect(type).toBe('axe');

        expect(meta).toEqual({
          thresholdLimit: 'upper',
          thresholdType: 'number',
        });

        const check = cb({
          chrome,
          commandOptions: {
            comment: true,
            cwd: __dirname,
            verbose: false,
          },
          url: 'http://example.com',
        });

        await expect(check).rejects.toThrow(new Error('Could not open page to analyze with axe'));

        expect(newPage).toHaveBeenCalledWith();
      },
    );

    jest.doMock(
      'deepmerge',
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (): Deepmerge => (x: any, y: any): any => {
        deepmergeMock(x, y);
        return realdeepmerge(x, y);
      },
    );

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    jest.doMock('@modus/gimbal-core/lib/module/registry', (): any => ({
      register,
    }));

    const { default: Axe } = await import('./index');

    await Axe(
      {
        dir: 'foo',
        event,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        program: Command as any,
        utils: {
          envOrDefault: (): string => 'foo',
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          getOptionsFromCommand: (): any => {},
          resolvePath: (): string => 'foo',
        },
      },
      {
        showSuccesses: true,
        thresholds: {
          impact: 'minor',
        },
      },
    );

    expect(deepmergeMock).toHaveBeenCalledWith(
      {
        showSuccesses: true,
        thresholds: {
          impact: 'none',
        },
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
      { thresholdLimit: 'upper', thresholdType: 'number' },
      expect.any(Function),
    );
  });
});
