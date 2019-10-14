import { ParsedArgs } from 'minimist';
import { CIs } from '@/ci';
import GitHub from '@/vcs/GitHub';
import { Report, ReportItem } from '@/typings/command';

export interface CommentBuildStartEvent {
  ci: CIs;
  report: Report;
  vcs: GitHub;
}

export interface CommentBuildEndEvent extends CommentBuildStartEvent {
  markdown: string;
}

export interface CommentRenderTableStartEvent {
  args: ParsedArgs;
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
