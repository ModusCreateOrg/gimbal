beforeEach((): void => {
  jest.resetModules();
});

describe('@modus/gimbal-core/event/index', (): void => {
  describe('on', (): void => {
    it('should add a callback', async (): Promise<void> => {
      const { default: Emitter } = await import('./index');
      const fn = jest.fn().mockResolvedValue('returned');

      Emitter.on('foo', fn);

      const ret = await Emitter.fire('foo', 'bar');

      expect(ret).toEqual({
        data: 'bar',
        rets: ['returned'],
      });

      expect(fn).toHaveBeenCalledWith('foo', 'bar');
    });

    it('should be able to listen using glob event names', async (): Promise<void> => {
      const { default: Emitter } = await import('./index');
      const fn1 = jest.fn().mockResolvedValue('first');
      const fn2 = jest.fn().mockResolvedValue('second');

      Emitter.on('foo/*/*', fn1);
      Emitter.on('foo/**/*', fn2);

      const ret = await Emitter.fire('foo/bar/baz', 'bar');

      expect(ret).toEqual({
        data: 'bar',
        rets: ['first', 'second'],
      });

      expect(fn1).toHaveBeenCalledWith('foo/bar/baz', 'bar');
      expect(fn2).toHaveBeenCalledWith('foo/bar/baz', 'bar');
    });
  });

  describe('fire', (): void => {
    it('should be able to fire event', async (): Promise<void> => {
      const { default: Emitter } = await import('./index');
      const fn = jest.fn().mockResolvedValue('returned');

      Emitter.on('foo', fn);

      const ret = await Emitter.fire('foo', 'bar');

      expect(ret).toEqual({
        data: 'bar',
        rets: ['returned'],
      });

      expect(fn).toHaveBeenCalledWith('foo', 'bar');
    });

    it('should be able to fire event with multiple listeners', async (): Promise<void> => {
      const { default: Emitter } = await import('./index');
      const fn1 = jest.fn().mockResolvedValue('first');
      const fn2 = jest.fn().mockResolvedValue('second');

      Emitter.on('foo', fn1);
      Emitter.on('foo', fn2);

      const ret = await Emitter.fire('foo', 'bar');

      expect(ret).toEqual({
        data: 'bar',
        rets: ['first', 'second'],
      });

      expect(fn1).toHaveBeenCalledWith('foo', 'bar');
      expect(fn2).toHaveBeenCalledWith('foo', 'bar');
    });

    it('should fire by priority', async (): Promise<void> => {
      const { default: Emitter } = await import('./index');
      const fn1 = jest.fn().mockResolvedValue('first');
      const fn2 = jest.fn().mockResolvedValue('second');
      const fn3 = jest.fn().mockResolvedValue('third');
      const fn4 = jest.fn().mockResolvedValue('fourth');
      const fn5 = jest.fn().mockResolvedValue('fifth');

      Emitter.on('foo', fn1);
      Emitter.on('foo', {
        fn: fn2,
        priority: -10,
      });
      Emitter.on('foo', {
        fn: fn3,
        priority: -300,
      });
      Emitter.on('foo', {
        fn: fn4,
        priority: -200,
      });
      Emitter.on('foo/bar', fn5);

      const ret = await Emitter.fire('foo', 'bar');

      expect(ret).toEqual({
        data: 'bar',
        rets: ['third', 'fourth', 'second', 'first'],
      });

      expect(fn1).toHaveBeenCalledWith('foo', 'bar');
      expect(fn2).toHaveBeenCalledWith('foo', 'bar');
      expect(fn3).toHaveBeenCalledWith('foo', 'bar');
      expect(fn4).toHaveBeenCalledWith('foo', 'bar');
      expect(fn5).not.toHaveBeenCalled();
    });

    it('should handle no matches', async (): Promise<void> => {
      const { default: Emitter } = await import('./index');
      const fn1 = jest.fn().mockResolvedValue('first');
      const fn2 = jest.fn().mockResolvedValue('second');

      Emitter.on('foo', fn1);
      Emitter.on('foo', fn2);

      const ret = await Emitter.fire('foobar', 'bar');

      expect(ret).toEqual({
        data: 'bar',
        rets: [],
      });

      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).not.toHaveBeenCalled();
    });
  });
});
