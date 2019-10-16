import { Callback, Config, Event } from '@/typings/event/Event';
import { Data } from '@/typings/utils/Queue';

export interface Emitter {
  fire: (event: string, data: Data) => Promise<FireRet>;
  on: (event: string, config: Callback | Config) => Event;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  un: (event: string, instance: any) => void;
}

export interface FireRet {
  data: Data;
  rets: (Data | void)[];
}
