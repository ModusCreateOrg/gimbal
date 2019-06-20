import envOrDefault from './env';

const ORIG_ENV = process.env;

beforeEach((): void => {
  process.env = {};
});

afterEach((): void => {
  process.env = { ...ORIG_ENV };
});

describe('@modus/gimbal-core/utils/env', (): void => {
  describe('envOrDefault', (): void => {
    test('should return the value', (): void => {
      process.env.foo = 'bar';

      const ret = envOrDefault('foo');

      expect(ret).toBe('bar');
    });

    test('should return true as a boolean', (): void => {
      process.env.foo = 'true';

      const ret = envOrDefault('foo');

      expect(ret).toBe(true);
    });

    test('should return false as a boolean', (): void => {
      process.env.foo = 'false';

      const ret = envOrDefault('foo');

      expect(ret).toBe(false);
    });

    test('should return default value', (): void => {
      const ret = envOrDefault('foo', 'baz');

      expect(ret).toBe('baz');
    });
  });
});
