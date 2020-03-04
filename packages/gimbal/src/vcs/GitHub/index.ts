import Logger from '@modus/gimbal-core/lib/logger';
import env from '@modus/gimbal-core/lib/utils/env';
import { Octokit } from '@octokit/rest';
import { URL } from 'url';
import EventEmitter from '@/event';
import {
  CommitCommentStartEvent,
  CommitCommentEndEvent,
  CommitPRStartEvent,
  CommitPREndEvent,
} from '@/typings/vcs/GitHub';

const GITHUB_RE = /(?:www\.)?github\.com$/i;

const GITHUB_AUTH_TOKEN = 'GITHUB_AUTH_TOKEN';

export default class GitHub {
  public api = new Octokit({
    auth: env(GITHUB_AUTH_TOKEN),
  });

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public ci?: any; // TODO if typed this, will end in circle dependency, fix!

  public static is(url: URL): boolean {
    return url.hostname.match(GITHUB_RE) != null;
  }

  public get name(): string {
    return this.constructor.name;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public comment(body: string): Promise<any> | void {
    if (env(GITHUB_AUTH_TOKEN)) {
      const { ci } = this;

      if (ci.mode === 'pr') {
        return this.createPRComment(ci.pr, body);
      }

      return this.createCommitComment(ci.sha, body);
    }

    Logger.log(`No ${GITHUB_AUTH_TOKEN} environment variable, skipping commenting`);

    return undefined;
  }

  private async createCommitComment(
    /* eslint-disable-next-line @typescript-eslint/camelcase,camelcase */
    commit_sha: string,
    body: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const comment = {
      body,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      commit_sha,
      owner: this.ci.owner,
      repo: this.ci.repo,
    };

    const commitCommentStartEvent: CommitCommentStartEvent = {
      comment,
      vcs: this,
    };

    await EventEmitter.fire(`vcs/comment/github/commit/start`, commitCommentStartEvent);

    const ret = await this.api.repos.createCommitComment(comment);

    const commitCommentEndEvent: CommitCommentEndEvent = {
      comment,
      ret,
      vcs: this,
    };

    await EventEmitter.fire(`vcs/comment/github/commit/end`, commitCommentEndEvent);

    return ret;
  }

  private async createPRComment(
    /* eslint-disable-next-line @typescript-eslint/camelcase,camelcase */
    issue_number: number,
    body: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const comment = {
      body,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      issue_number,
      owner: this.ci.owner,
      repo: this.ci.repo,
    };

    const commitPRStartEvent: CommitPRStartEvent = {
      comment,
      vcs: this,
    };

    await EventEmitter.fire(`vcs/comment/github/pr/start`, commitPRStartEvent);

    const ret = await this.api.issues.createComment(comment);

    const commitPREndEvent: CommitPREndEvent = {
      comment,
      ret,
      vcs: this,
    };

    await EventEmitter.fire(`vcs/comment/github/pr/end`, commitPREndEvent);

    return ret;
  }
}
