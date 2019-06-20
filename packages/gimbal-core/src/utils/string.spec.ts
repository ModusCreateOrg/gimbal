import { pad, splitOnWhitespace } from './string';

describe('@modus/gimbal-core/utils/string', (): void => {
  describe('pad', (): void => {
    it('should pad a string', (): void => {
      const ret = pad(4);

      expect(ret).toBe('    ');
    });

    it('should pad a string with a character', (): void => {
      const ret = pad(4, '-');

      expect(ret).toBe('----');
    });
  });

  describe('splitOnWhitespace', (): void => {
    it('should split', (): void => {
      const ret = splitOnWhitespace('hello there');

      expect(ret).toEqual(['hello', 'there']);
    });

    it('should split with lots of spaces', (): void => {
      const ret = splitOnWhitespace('    hello         there    ');

      expect(ret).toEqual(['hello', 'there']);
    });
  });
});
