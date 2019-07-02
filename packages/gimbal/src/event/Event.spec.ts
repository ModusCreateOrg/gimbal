import Event from './Event';

describe('@modus/gimbal-core/event/Event', (): void => {
  describe('fire', (): void => {
    it('should fire an event', (): void => {
      const fn = jest.fn().mockReturnValue('returned');
      const instance = new Event('foo', fn);

      const ret = instance.fire('foo', 'bar');

      expect(ret).toBe('returned');

      expect(fn).toHaveBeenCalledWith('foo', 'bar');
    });

    it('should fire an event when configured with an object', (): void => {
      const fn = jest.fn().mockReturnValue('returned');
      const instance = new Event('foo', {
        fn,
        priority: -10,
      });

      expect(instance.priority).toBe(-10);

      const ret = instance.fire('foo', 'bar');

      expect(ret).toBe('returned');

      expect(fn).toHaveBeenCalledWith('foo', 'bar');
    });
  });

  describe('createCallback', (): void => {
    it('should create a function to fire with', (): void => {
      const fn = jest.fn().mockReturnValue('returned');
      const instance = new Event('foo', {
        fn,
      });

      const cb = instance.createCallback('foo');
      const ret = cb('bar');

      expect(ret).toBe('returned');

      expect(fn).toHaveBeenCalledWith('foo', 'bar');
    });
  });
});
