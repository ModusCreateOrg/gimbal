import env from '@modus/gimbal-core/lib/utils/env';
import { CIMode } from '@/typings/ci';
import { VCS as VCSTypes } from '@/typings/vcs';
import GitHub from '@/vcs/GitHub';

const PR_REG = /^refs\/pull\/([0-9]+)\/merge$/;

export default class GitHubActions {
  private $vcs?: VCSTypes;

  public static is(): boolean {
    return env('GITHUB_ACTIONS', false) as boolean;
  }

  public get mode(): CIMode {
    return 'commit';
  }

  public get name(): string {
    return this.constructor.name;
  }

  public get owner(): string {
    return env('GITHUB_REPOSITORY').split('/')[0];
  }

  public get pr(): number | void {
    const ref = env('GITHUB_REF');

    if (ref) {
      const matches = ref.match(PR_REG);

      if (matches) {
        return Number(matches[1]);
      }
    }

    return undefined;
  }

  public get repo(): string {
    return env('GITHUB_REPOSITORY').split('/')[1];
  }

  public get sha(): string {
    return env('GITHUB_SHA') as string;
  }

  public get vcs(): GitHub | void {
    if (this.$vcs) {
      return this.$vcs;
    }

    this.$vcs = new GitHub();

    this.$vcs.ci = this;

    return this.$vcs;
  }
}
