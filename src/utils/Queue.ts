import { Data, Mode } from '@/typings/utils/Queue';

interface Config {
  mode?: Mode;
}

class Queue {
  private mode: Mode = 'sequential';

  private queue: Data[] = [];

  public consturctor(config: Config = {}): void {
    if (config.mode) {
      this.mode = config.mode;
    }
  }

  public add(...add: Data[]): void {
    this.queue.push(...add);
  }

  public run(...data: Data[]): Promise<Data[]> {
    const { mode, queue } = this;

    return mode === 'sequential' ? this.runSequential(queue, data) : this.runParallel(queue, data);
  }

  private runSequential(queue: Data[], data: Data[]): Promise<Data[]> {
    return queue.reduce(
      (promise: Promise<Data>, fn: Data): Promise<Data> =>
        promise.then(
          async (rets: Data[]): Promise<Data> => {
            const ret = await fn(...data);

            rets.push(ret);

            return rets;
          },
        ),
      Promise.resolve([]),
    );
  }

  private runParallel(queue: Data[], data: Data[]): Promise<Data[]> {
    return Promise.all(queue.map((fn: Data): Promise<Data> => fn(...data)));
  }
}

export default Queue;
