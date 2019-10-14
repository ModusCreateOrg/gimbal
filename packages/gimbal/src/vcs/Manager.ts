import Manager from '@modus/gimbal-core/lib/Manager';
import { URL } from 'url';
import Config from '../config';
import { Cls, VCS as VCSTypes } from '@/typings/vcs';
import GitHubCls from './GitHub';

const GIT_URL_RE = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/;

let vcs: GitHubCls | void;

interface VCSConfig {
  provider: string;
}

const normalizeConfiguredVCS = (configuredVCS?: string | VCSConfig): VCSConfig | void => {
  if (configuredVCS) {
    return typeof configuredVCS === 'string' ? { provider: configuredVCS } : configuredVCS;
  }

  return undefined;
};

const gitUrlToHttpUrl = (gitUrl: string): string => {
  const matches = gitUrl.match(GIT_URL_RE);

  if (!matches) {
    return gitUrl;
  }

  const ssh = Boolean(matches[4]);
  // a ssh url has git@github.com, we just want github.com
  const start = ssh ? matches[4].split('@')[1] : matches[7];
  // https url has it part of the 7 index used in start
  const end = ssh ? `/${matches[7]}` : '';

  return `https://${start}${end}`;
};

class VCSManager extends Manager {
  getActive(repoUrl: string): VCSTypes | void {
    if (vcs) {
      return vcs;
    }

    const configuredVCS = normalizeConfiguredVCS(Config.get('configs.vcs'));
    const url = new URL(gitUrlToHttpUrl(repoUrl));

    if (configuredVCS) {
      const match = this.get(configuredVCS.provider);

      if (match) {
        return match;
      }
    }

    const found: VCSTypes | void = this.find((_name: string, cls: Cls): boolean => cls.is(url));

    vcs = found;

    return vcs;
  }
}

export default VCSManager;
