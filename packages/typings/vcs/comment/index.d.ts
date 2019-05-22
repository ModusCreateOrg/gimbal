import CircleCI from '@/ci/CircleCI';
import TravisCI from '@/ci/TravisCI';
import GitHub from '@/vcs/GitHub';

export interface CommentStartEvent {
  ci: CircleCI | TravisCI;
  comment: string;
  vcs: GitHub;
}

export interface CommentEndEvent {
  ci: CircleCI | TravisCI;
  comment: string;
  vcs: GitHub;
}
