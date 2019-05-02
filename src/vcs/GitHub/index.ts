import Octokit from '@octokit/rest';
import { URL } from 'url';
import env from '@/utils/env';

const GITHUB_RE = /(?:www\.)?github\.com$/i;

export default class GitHub {
  public api = new Octokit({
    auth: env('GITHUB_AUTH_TOKEN'),
  });

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public ci?: any; // TODO if typed this, will end in circle dependency, fix!

  public static is(url: URL): boolean {
    return url.hostname.match(GITHUB_RE) != null;
  }

  public get name(): string {
    return this.constructor.name;
  }

  public comment(
    body: string,
  ): Promise<
    Octokit.Response<Octokit.ReposCreateCommitCommentResponse> | Octokit.Response<Octokit.IssuesCreateCommentResponse>
    /* eslint-disable-next-line @typescript-eslint/indent */
  > {
    const { ci } = this;

    if (ci.mode === 'pr') {
      return this.createPRComment(ci.pr, body);
    }

    return this.createCommitComment(ci.sha, body);
  }

  private createCommitComment(
    sha: string,
    body: string,
  ): Promise<Octokit.Response<Octokit.ReposCreateCommitCommentResponse>> {
    return this.api.repos.createCommitComment({
      body,
      sha,
      owner: this.ci.owner,
      repo: this.ci.repo,
    });
  }

  private createPRComment(
    /* eslint-disable-next-line @typescript-eslint/camelcase,camelcase */
    issue_number: number,
    body: string,
  ): Promise<Octokit.Response<Octokit.IssuesCreateCommentResponse>> {
    return this.api.issues.createComment({
      body,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      issue_number,
      owner: this.ci.owner,
      repo: this.ci.repo,
    });
  }
}
