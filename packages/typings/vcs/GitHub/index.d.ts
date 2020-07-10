import { OctokitResponse } from '@octokit/types';

export interface CommitCommentStartEvent {
  comment: unknown; // ReposCreateCommitCommentParams
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  vcs: any; // would cause circular dependency if imported the command class
}

export interface CommitCommentEndEvent {
  comment: unknown; // ReposCreateCommitCommentParams
  ret: OctokitResponse<unknown>; // ReposCreateCommitCommentResponse
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  vcs: any; // would cause circular dependency if imported the command class
}

export interface CommitPRStartEvent {
  comment: unknown; // IssuesCreateCommentParams
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  vcs: any; // would cause circular dependency if imported the command class
}

export interface CommitPREndEvent {
  comment: unknown; // IssuesCreateCommentParams
  ret: OctokitResponse<unknown>; // IssuesCreateCommentResponse
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  vcs: any; // would cause circular dependency if imported the command class
}
