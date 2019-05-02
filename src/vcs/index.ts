import { URL } from 'url';
import Config from '@/config';
import { Cls, VCS as VCSTypes } from '@/typings/vcs';
import GitHubCls from './GitHub';

const GIT_URL_RE = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/;

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

const whichVCS = (repoUrl: string): VCSTypes | void => {
  if (vcs) {
    return vcs;
  }

  const configuredVCS = normalizeConfiguredVCS(Config.get('configs.vcs'));
  const url = new URL(gitUrlToHttpUrl(repoUrl));
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
