import { ArgsContext } from './args';
import { EventContext } from './event';
import { ModuleContext } from './module';

export interface Context {
  readonly args: ArgsContext;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  readonly config: any;
  readonly event: EventContext;
  readonly module: ModuleContext;
}
