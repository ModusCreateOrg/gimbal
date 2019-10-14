import Manager from '@modus/gimbal-core/lib/Manager';

import Config from '../config';
import CircleCICls from './CircleCI';
import GitHubActionsCls from './GitHubActions';
import TravisCICls from './TravisCI';

import { Cls } from '@/typings/ci';

export const CircleCI = 'CircleCI';
export const GitHubActions = 'GitHubActions';
export const TravisCI = 'TravisCI';

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
      const match = this.get(configuredCI.provider);

      if (match) {
        return match;
      }
    }

    const found: CIs | void = this.find((_name: string, cls: Cls): boolean => cls.is());

    ci = found;

    return ci;
  }
}

export default CIManager;
