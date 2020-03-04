import Manager from '@modus/gimbal-core/lib/Manager';
import { URL } from 'url';
import { Cls } from '@/typings/vcs';
import Config from '../config';
import GitHubCls from './GitHub';

const GIT_URL_RE = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/;

type VCSTypes = typeof GitHubCls;
type VCSs = GitHubCls;

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
  getActive(repoUrl: string): VCSs | void {
    if (vcs != null) {
      return vcs;
    }

    const configuredVCS = normalizeConfiguredVCS(Config.get('configs.vcs'));
    const url = new URL(gitUrlToHttpUrl(repoUrl));

    if (configuredVCS) {
      const MatchVCS = this.get(configuredVCS.provider);

      if (MatchVCS != null) {
        vcs = new MatchVCS();

        return vcs;
      }
    }

    const found: [string, VCSTypes] | void = this.find((_name: string, cls: Cls): boolean => cls.is(url));

    if (found != null) {
      const [, FoundFCS] = found;

      vcs = new FoundFCS();
    }

    return vcs;
  }
}

export default VCSManager;
