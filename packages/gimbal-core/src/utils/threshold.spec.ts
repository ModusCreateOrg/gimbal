import checkThreshold, { checkPercentage, checkValue, isPercentage, percentToNumber } from './threshold';

describe('@modus/gimbal-core/utils/threshold', (): void => {
  describe('checkPercentage', (): void => {
    describe('lower mode', (): void => {
      it('should succeed', (): void => {
        const ret = checkPercentage('4%', '2%', 'lower');

        expect(ret).toBe(true);
      });

      it('should succeed when same value', (): void => {
        const ret = checkPercentage('4%', '4%', 'lower');

        expect(ret).toBe(true);
      });

      it('should fail', (): void => {
        const ret = checkPercentage('4%', '5%', 'lower');

        expect(ret).toBe(false);
      });
    });

    describe('upper mode', (): void => {
      it('should succeed', (): void => {
        const ret = checkPercentage('4%', '5%', 'upper');

        expect(ret).toBe(true);
      });

      it('should succeed when same value', (): void => {
        const ret = checkPercentage('4%', '4%', 'upper');

        expect(ret).toBe(true);
      });

      it('should fail', (): void => {
        const ret = checkPercentage('4%', '3%', 'upper');

        expect(ret).toBe(false);
      });
    });
  });

  describe('checkValue', (): void => {
    describe('lower mode', (): void => {
      it('should succeed', (): void => {
        const ret = checkValue(4, 2, 'lower');

        expect(ret).toBe(true);
      });

      it('should succeed when same value', (): void => {
        const ret = checkValue(4, 4, 'lower');

        expect(ret).toBe(true);
      });

      it('should fail', (): void => {
        const ret = checkValue(4, 5, 'lower');

        expect(ret).toBe(false);
      });
    });

    describe('upper mode', (): void => {
      it('should succeed', (): void => {
        const ret = checkValue(4, 5, 'upper');

        expect(ret).toBe(true);
      });

      it('should succeed when same value', (): void => {
        const ret = checkValue(4, 4, 'upper');

        expect(ret).toBe(true);
      });

      it('should fail', (): void => {
        const ret = checkValue(4, 3, 'upper');

        expect(ret).toBe(false);
      });
    });
  });

  describe('isPercentage', (): void => {
    it('should be a percentage', (): void => {
      const ret = isPercentage('1%');

      expect(ret).toBe(true);
    });

    it('should not be a percentage', (): void => {
      const ret = isPercentage(1458917245);

      expect(ret).toBe(false);
    });
  });

  describe('percentToNumber', (): void => {
    it('should return a number', (): void => {
      const ret = percentToNumber('58%');

      expect(ret).toBe(58);
    });
  });

  describe('checkThreshold', (): void => {
    describe('lower mode', (): void => {
      it('should succeed with a percentage', (): void => {
        const ret = checkThreshold('4%', '2%', 'lower');

        expect(ret).toBe(true);
      });

      it('should succeed with a percentage when same value', (): void => {
        const ret = checkThreshold('4%', '4%', 'lower');

        expect(ret).toBe(true);
      });

      it('should fail with a percentage', (): void => {
        const ret = checkThreshold('4%', '5%', 'lower');

        expect(ret).toBe(false);
      });

      it('should succeed with a value', (): void => {
        const ret = checkThreshold(4, 2, 'lower');

        expect(ret).toBe(true);
      });

      it('should succeed with a value when same value', (): void => {
        const ret = checkThreshold(4, 4, 'lower');

        expect(ret).toBe(true);
      });

      it('should fail with a value', (): void => {
        const ret = checkThreshold(4, 5, 'lower');

        expect(ret).toBe(false);
      });
    });

    describe('upper mode', (): void => {
      it('should succeed with a percentage', (): void => {
        const ret = checkThreshold('4%', '5%');

        expect(ret).toBe(true);
      });

      it('should succeed with a percentage when same value', (): void => {
        const ret = checkThreshold('4%', '4%');

        expect(ret).toBe(true);
      });

      it('should fail with a percentage', (): void => {
        const ret = checkThreshold('4%', '3%');

        expect(ret).toBe(false);
      });

      it('should succeed with a value', (): void => {
        const ret = checkThreshold(4, 5);

        expect(ret).toBe(true);
      });

      it('should succeed with a value when same value', (): void => {
        const ret = checkThreshold(4, 4);

        expect(ret).toBe(true);
      });

      it('should fail with a value', (): void => {
        const ret = checkThreshold(4, 3);

        expect(ret).toBe(false);
      });
    });
  });
});
