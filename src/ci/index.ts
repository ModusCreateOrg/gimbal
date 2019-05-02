import Config from '@/config';
import { Cls } from '@/typings/ci';
import CircleCICls from './CircleCI';
import TravisCICls from './TravisCI';

export const CircleCI = 'CircleCI';
export const TravisCI = 'TravisCI';

let ci: CircleCICls | TravisCICls | void;

interface Tests {
  [label: string]: Cls;
}

interface CIConfig {
  provider: string;
}

const tests: Tests = {
  [CircleCI]: CircleCICls,
  [TravisCI]: TravisCICls,
};

const normalizeConfiguredCI = (configuredCI?: string | CIConfig): CIConfig | void => {
  if (configuredCI) {
    return typeof configuredCI === 'string' ? { provider: configuredCI as string } : (configuredCI as CIConfig);
  }

  return undefined;
};

const whichCI = (): CircleCICls | TravisCICls | void => {
  if (ci) {
    return ci;
  }

  const configuredCI = normalizeConfiguredCI(Config.get('configs.ci'));
  const CI = configuredCI ? configuredCI.provider : Object.keys(tests).find((key: string): boolean => tests[key].is());

  switch (CI) {
    case CircleCI:
      ci = new CircleCICls();

      return ci;
    case TravisCI:
      ci = new TravisCICls();

      return ci;
    default:
      return undefined;
  }
};

export default whichCI;
