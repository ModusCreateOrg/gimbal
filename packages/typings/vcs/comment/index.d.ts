import { CIs } from '@/ci';
import GitHub from '@/vcs/GitHub';
import { Report, ReportItem } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

export interface CommentBuildStartEvent {
  ci: CIs;
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
  ci: CIs;
  comment: string;
  report: Report;
  vcs: GitHub;
}

export interface CommentEndEvent extends CommentStartEvent {
  comment: string;
}

export interface CommentObject {
  onlyFailures?: boolean;
}

export type Comment = boolean | CommentObject;
