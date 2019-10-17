import { sectionHeading, successOrFailure } from './colors';

const ORIG_ENV = process.env;

beforeEach((): void => {
  process.env = {};
});

afterEach((): void => {
  process.env = { ...ORIG_ENV };
});

describe('@modus/gimbal-core/utils/colors', (): void => {
  describe('sectionHeading', (): void => {
    it('should bold text', (): void => {
      // in a CI, force the color
      process.env['FORCE_COLOR'] = 'true';

      const ret = sectionHeading('this should be bold');

      expect(ret).toBe('[1mthis should be bold[22m');
    });
  });

  describe('successOrFailure', (): void => {
    it('should be green for success', (): void => {
      // in a CI, force the color
      process.env['FORCE_COLOR'] = 'true';

      const ret = successOrFailure('this should be green', true);

      expect(ret).toBe('[32mthis should be green[39m');
    });

    it('should be red for failure', (): void => {
      // in a CI, force the color
      process.env['FORCE_COLOR'] = 'true';

      const ret = successOrFailure('this should be red', false);

      expect(ret).toBe('[31mthis should be red[39m');
    });
  });
});
