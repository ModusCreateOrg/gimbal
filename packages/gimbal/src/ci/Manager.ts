import Manager from '@modus/gimbal-core/lib/Manager';
import { Cls } from '@/typings/ci';
import Config from '../config';
import CircleCICls from './CircleCI';
import GitHubActionsCls from './GitHubActions';
import TravisCICls from './TravisCI';

export const CircleCI = 'CircleCI';
export const GitHubActions = 'GitHubActions';
export const TravisCI = 'TravisCI';

type CITypes = typeof CircleCICls | typeof GitHubActionsCls | typeof TravisCICls;

export type CIs = CircleCICls | GitHubActionsCls | TravisCICls;

let ci: CIs | void;

interface CIConfig {
  provider: string;
}

const normalizeConfiguredCI = (configuredCI?: string | CIConfig): CIConfig | void => {
  if (configuredCI) {
    return typeof configuredCI === 'string' ? { provider: configuredCI } : configuredCI;
  }

  return undefined;
};

class CIManager extends Manager {
  getActive(): CIs | void {
    if (ci != null) {
      return ci;
    }

    const configuredCI = normalizeConfiguredCI(Config.get('configs.ci'));

    if (configuredCI) {
      const MatchCI: CITypes | void = this.get(configuredCI.provider);

      if (MatchCI != null) {
        ci = new MatchCI();

        return ci;
      }
    }

    const found: [string, CITypes] | void = this.find((_name: string, cls: Cls): boolean => cls.is());

    if (found != null) {
      const [, FoundCI] = found;

      ci = new FoundCI();
    }

    return ci;
  }
}

export default CIManager;
