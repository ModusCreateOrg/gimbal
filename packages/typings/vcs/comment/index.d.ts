import { CIs } from '@/ci';
import GitHub from '@/vcs/GitHub';
import { Report, ReportItem } from '@/typings/command';
import { Context } from '@/typings/context';

export interface CommentBuildStartEvent {
  ci: CIs;
  context: Context;
  report: Report;
  vcs: GitHub;
}

export interface CommentBuildEndEvent extends CommentBuildStartEvent {
  markdown: string;
}

export interface CommentRenderTableStartEvent {
  context: Context;
  reportItem: ReportItem;
}

export interface CommentRenderTableEndEvent extends CommentRenderTableStartEvent {
  renderedTable: string;
}

export interface CommentStartEvent {
  ci: CIs;
  comment: string;
  context: Context;
  report: Report;
  vcs: GitHub;
}

export interface CommentEndEvent extends CommentStartEvent {
  comment: string;
}

export interface CommentObject {
  header?: string;
  onlyFailures?: boolean;
}

export type Comment = boolean | CommentObject;
