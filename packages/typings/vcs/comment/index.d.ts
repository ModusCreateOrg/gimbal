import CircleCI from '@/ci/CircleCI';
import TravisCI from '@/ci/TravisCI';
import GitHub from '@/vcs/GitHub';
import { Report, ReportItem } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

export interface CommentBuildStartEvent {
  ci: CircleCI | TravisCI;
  report: Report;
  vcs: GitHub;
}

export interface CommentBuildEndEvent extends CommentBuildStartEvent {
  markdown: string;
}

export interface CommentRenderTableStartEvent {
  commandOptions: CommandOptions;
  reportItem: ReportItem;
}

export interface CommentRenderTableEndEvent extends CommentRenderTableStartEvent {
  renderedTable: string;
}

export interface CommentStartEvent {
  ci: CircleCI | TravisCI;
  comment: string;
  report: Report;
  vcs: GitHub;
}

export interface CommentEndEvent extends CommentStartEvent {
  comment: string;
}
