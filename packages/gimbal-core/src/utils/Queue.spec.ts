import Queue from './Queue';

describe('@modus/gimbal-core/utils/Queue', (): void => {
  describe('add', (): void => {
    it('should add to the queue', async (): Promise<void> => {
      const instance = new Queue();
      const spy = jest.fn();

      instance.add(spy);

      await instance.run();

      expect(spy).toHaveBeenCalled();
    });

    it('should add multiple to the queue', async (): Promise<void> => {
      const instance = new Queue();
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      instance.add(spy1, spy2);

      await instance.run();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('run', (): void => {
    describe('sequential', (): void => {
      it('should run in sequence', async (): Promise<void> => {
        const instance = new Queue();
        const spy1 = jest.fn().mockResolvedValue('first');
        const spy2 = jest.fn().mockResolvedValue('second');

        instance.add(spy1, spy2);

        const ret = await instance.run('data');

        expect(ret).toEqual(['first', 'second']);

        expect(spy1).toHaveBeenCalledWith('data');
        expect(spy2).toHaveBeenCalledWith('data');
      });
    });

    describe('parallel', (): void => {
      it('should run in parallel', async (): Promise<void> => {
        const instance = new Queue({
          mode: 'parallel',
        });
        const spy1 = jest.fn().mockResolvedValue('first');
        const spy2 = jest.fn().mockResolvedValue('second');

        instance.add(spy1, spy2);

        const ret = await instance.run('data');

        expect(ret).toEqual(['first', 'second']);

        expect(spy1).toHaveBeenCalledWith('data');
        expect(spy2).toHaveBeenCalledWith('data');
      });
    });
  });
});
