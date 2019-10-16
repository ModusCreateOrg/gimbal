import logger from '@modus/gimbal-core/lib/logger';
import Config from '../config';
import ArgsContext from './args';
import EventContext from './event';
import ModuleContext from './module';

import { Logger } from '@/typings/logger/index';

class Context {
  public readonly args: ArgsContext = new ArgsContext();

  public readonly config: typeof Config = Config;

  public readonly event: EventContext = new EventContext();

  public readonly logger: Logger = logger;

  public readonly module: ModuleContext = new ModuleContext();
}

export default Context;
