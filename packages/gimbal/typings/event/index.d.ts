import Event from '@/event/Event';
import { Callback, Config } from '@/typings/event/Event';
import { Data } from '@/typings/utils/Queue';

export interface Emitter {
  fire: (event: string, data: Data) => Promise<FireRet>;
  on: (event: string, config: Callback | Config) => Event;
}

export interface FireRet {
  data: Data;
  rets: (Data | void)[];
}
