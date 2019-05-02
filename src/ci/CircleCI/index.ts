import { CIMode } from '@/typings/ci';
import { VCS as VCSTypes } from '@/typings/vcs';
import env from '@/utils/env';
import whichVCS from '@/vcs';

export default class CircleCI {
  private $vcs?: VCSTypes;

  public static is(): boolean {
    return env('CIRCLECI', false) as boolean;
  }

  public get mode(): CIMode {
    return env('CIRCLE_PULL_REQUEST') ? 'pr' : 'commit';
  }

  public get name(): string {
    return this.constructor.name;
  }

  public get owner(): string {
    return env('CIRCLE_PROJECT_USERNAME');
  }

  public get pr(): number | void {
    const pr = env('CIRCLE_PR_NUMBER');

    return pr ? (pr as number) : undefined;
  }

  public get repo(): string {
    return env('CIRCLE_PROJECT_REPONAME');
  }

  public get sha(): string {
    return env('CIRCLE_SHA1') as string;
  }

  public get vcs(): VCSTypes | void {
    if (this.$vcs) {
      return this.$vcs;
    }

    const repoUrl = env('CIRCLE_REPOSITORY_URL');

    if (repoUrl) {
      this.$vcs = whichVCS(repoUrl) as VCSTypes;

      this.$vcs.ci = this;

      return this.$vcs;
    }

    return undefined;
  }
}
