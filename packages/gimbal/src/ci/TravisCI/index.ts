import env from '@modus/gimbal-core/lib/utils/env';
import { CIMode } from '@/typings/ci';
import { VCS as VCSTypes } from '@/typings/vcs';
import GitHub from '@/vcs/GitHub';

export default class TravisCI {
  private $vcs?: VCSTypes;

  public static is(): boolean {
    return env('TRAVIS', false) as boolean;
  }

  public get mode(): CIMode {
    return env('TRAVIS_PULL_REQUEST') ? 'pr' : 'commit';
  }

  public get name(): string {
    return this.constructor.name;
  }

  public get owner(): string {
    const slug = env('TRAVIS_REPO_SLUG');

    return slug.split('/')[0];
  }

  public get pr(): number | void {
    const pr = env('TRAVIS_PULL_REQUEST');

    return pr ? (pr as number) : undefined;
  }

  public get repo(): string {
    const slug = env('TRAVIS_REPO_SLUG');

    return slug.split('/')[1];
  }

  public get sha(): string {
    return env('TRAVIS_COMMIT') as string;
  }

  public get vcs(): GitHub | void {
    if (this.$vcs) {
      return this.$vcs;
    }

    const slug = env('TRAVIS_REPO_SLUG');

    if (slug) {
      this.$vcs = new GitHub();

      this.$vcs.ci = this;

      return this.$vcs;
    }

    return undefined;
  }
}
