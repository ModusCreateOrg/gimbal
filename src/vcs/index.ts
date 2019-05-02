import { URL } from 'url';
import Config from '@/config';
import { Cls, VCS as VCSTypes } from '@/typings/vcs';
import GitHubCls from './GitHub';

export const GitHub = 'GitHub';

interface Tests {
  [label: string]: Cls;
}

interface VCSConfig {
  provider: string;
}

const tests: Tests = {
  [GitHub]: GitHubCls,
};

let vcs: GitHubCls | void;

const normalizeConfiguredVCS = (configuredVCS?: string | VCSConfig): VCSConfig | void => {
  if (configuredVCS) {
    return typeof configuredVCS === 'string' ? { provider: configuredVCS as string } : (configuredVCS as VCSConfig);
  }

  return undefined;
};

const whichVCS = (repoUrl: string): VCSTypes | void => {
  if (vcs) {
    return vcs;
  }

  const configuredVCS = normalizeConfiguredVCS(Config.get('configs.vcs'));
  const url = new URL(repoUrl);
  const VCS = configuredVCS
    ? configuredVCS.provider
    : Object.keys(tests).find((key: string): boolean => tests[key].is(url));

  switch (VCS) {
    case GitHub:
      vcs = new GitHubCls();

      return vcs;
    default:
      return undefined;
  }
};

export default whichVCS;
