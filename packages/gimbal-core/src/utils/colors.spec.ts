import { sectionHeading, successOrFailure } from './colors';

describe('@modus/gimbal-core/utils/colors', (): void => {
  describe('sectionHeading', (): void => {
    it('should bold text', (): void => {
      const ret = sectionHeading('this should be bold');

      expect(ret).toBe('[1mthis should be bold[22m');
    });
  });

  describe('successOrFailure', (): void => {
    it('should be green for success', (): void => {
      const ret = successOrFailure('this should be green', true);

      expect(ret).toBe('[32mthis should be green[39m');
    });

    it('should be red for failure', (): void => {
      const ret = successOrFailure('this should be red', false);

      expect(ret).toBe('[31mthis should be red[39m');
    });
  });
});
