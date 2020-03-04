import { FireRet } from '@/typings/event';
import { Callback, Config } from '@/typings/event/Event';
import { Data } from '@/typings/utils/Queue';
import Emitter from '../../event';
import Event from '../../event/Event';

class EventContext {
  public on(event: string, config: Callback | Config): Event {
    return Emitter.on(event, config);
  }

  public un(event: string, instance: Event): void {
    return Emitter.un(event, instance);
  }

  public async fire(event: string, data: Data): Promise<FireRet> {
    return Emitter.fire(event, data);
  }
}

export default EventContext;
