import minimatch from 'minimatch';
import { FireRet } from '@/typings/event';
import { Callback, CreatedCallback, Config } from '@/typings/event/Event';
import { Data } from '@/typings/utils/Queue';
import Queue from '../utils/Queue';
import Event from './Event';

interface EventMap {
  [name: string]: Event[];
}

class Emitter {
  private events: EventMap = {};

  public on(event: string, config: Callback | Config): Event {
    const { events } = this;

    if (!events[event]) {
      events[event] = [];
    }

    const instance = new Event(event, config);

    events[event].push(instance);

    return instance;
  }

  public async fire(event: string, data: Data): Promise<FireRet> {
    const { events } = this;
    const matched: Event[] = [];
    const ret: FireRet = {
      data,
      rets: [],
    };

    Object.keys(events).forEach((name: string): void => {
      const match = minimatch(event, name);

      if (match) {
        matched.push(...events[name]);
      }
    });

    if (matched.length > 0) {
      const queue = new Queue();

      matched.sort((last: Event, next: Event): number => {
        const lastPriority = last.priority || 0;
        const nextPriority = next.priority || 0;

        if (lastPriority < nextPriority) {
          return -1;
        }

        if (lastPriority > nextPriority) {
          return 1;
        }

        return 0;
      });

      const args = matched.map((eventInstance: Event): CreatedCallback => eventInstance.createCallback(event));

      queue.add(...args);

      const rets = await queue.run(data);

      ret.rets.push(...rets);
    }

    return ret;
  }
}

export { Event };

export default new Emitter();
