const ORIG_ENV = process.env;

beforeEach((): void => {
  process.env = {};
});

afterEach((): void => {
  process.env = { ...ORIG_ENV };
});

describe('@modus/gimbal-core/utils/colors', (): void => {
  describe('sectionHeading', (): void => {
    it('should bold text', async (): Promise<void> => {
      const { sectionHeading } = await import('./colors');

      const ret = sectionHeading('this should be bold');

      expect(ret).toBe('[1mthis should be bold[22m');
    });
  });

  describe('successOrFailure', (): void => {
    it('should be green for success', async (): Promise<void> => {
      const { successOrFailure } = await import('./colors');

      const ret = successOrFailure('this should be green', true);

      expect(ret).toBe('[32mthis should be green[39m');
    });

    it('should be red for failure', async (): Promise<void> => {
      const { successOrFailure } = await import('./colors');

      const ret = successOrFailure('this should be red', false);

      expect(ret).toBe('[31mthis should be red[39m');
    });
  });
});
