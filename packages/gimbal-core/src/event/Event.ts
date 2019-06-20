import { Callback, CreatedCallback, Config } from '@/typings/event/Event';
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

  public fire(event: string, data: Data): Data | void {
    return this.fn(event, data);
  }

  public createCallback(event: string): CreatedCallback {
    return this.fire.bind(this, event);
  }
}

export default Event;
