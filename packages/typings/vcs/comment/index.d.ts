import CircleCI from '@/ci/CircleCI';
import TravisCI from '@/ci/TravisCI';
import GitHub from '@/vcs/GitHub';
import { Report, ReportItem } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import TableComp from '@modus/gimbal-core/lib/components/Table';

export interface CommentBuildStartEvent {
  ci: CircleCI | TravisCI;
  report: Report;
  vcs: GitHub;
}

export interface CommentBuildEndEvent {
  ci: CircleCI | TravisCI;
  markdown: string;
  report: Report;
  vcs: GitHub;
}

export interface CommentRenderTableStartEvent {
  commandOptions: CommandOptions;
  reportItem: ReportItem;
  table: TableComp;
}

export interface CommentRenderTableEndEvent {
  commandOptions: CommandOptions;
  renderedTable: string;
  reportItem: ReportItem;
  table: TableComp;
}

export interface CommentStartEvent {
  ci: CircleCI | TravisCI;
  comment: string;
  report: Report;
  vcs: GitHub;
}

export interface CommentEndEvent {
  ci: CircleCI | TravisCI;
  comment: string;
  report: Report;
  vcs: GitHub;
}
