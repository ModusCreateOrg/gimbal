import { Callback, Config } from '@/typings/event/Event';
import { Data } from '@/typings/utils/Queue';

class Event {
  private event: string;

  private fn: Callback;

  public priority: number = 0;

  public constructor(event: string, config: Callback | Config) {
    this.event = event;

    if (typeof config === 'function') {
      this.fn = config;
    } else {
      this.fn = config.fn;

      if (config.priority) {
        this.priority = config.priority;
      }
    }
  }

  public fire(data: Data): Data | void {
    return this.fn(data);
  }

  public createCallback(): Callback {
    return this.fire.bind(this);
  }
}

export default Event;
