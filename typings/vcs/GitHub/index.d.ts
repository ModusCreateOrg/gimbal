import {
  IssuesCreateCommentParams,
  IssuesCreateCommentResponse,
  ReposCreateCommitCommentParams,
  ReposCreateCommitCommentResponse,
  Response,
} from '@octokit/rest';

export interface CommitCommentStartEvent {
  comment: ReposCreateCommitCommentParams;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  vcs: any; // would cause circular dependency if imported the command class
}

export interface CommitCommentEndEvent {
  comment: ReposCreateCommitCommentParams;
  ret: Response<ReposCreateCommitCommentResponse>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  vcs: any; // would cause circular dependency if imported the command class
}

export interface CommitPRStartEvent {
  comment: IssuesCreateCommentParams;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  vcs: any; // would cause circular dependency if imported the command class
}

export interface CommitPREndEvent {
  comment: IssuesCreateCommentParams;
  ret: Response<IssuesCreateCommentResponse>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  vcs: any; // would cause circular dependency if imported the command class
}
