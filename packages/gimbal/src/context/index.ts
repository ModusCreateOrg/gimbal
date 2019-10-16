import Config from '../config';
import ArgsContext from './args';
import EventContext from './event';
import ModuleContext from './module';

class Context {
  public readonly args: ArgsContext = new ArgsContext();

  public readonly config: typeof Config = Config;

  public readonly event: EventContext = new EventContext();

  public readonly module: ModuleContext = new ModuleContext();
}

export default Context;
