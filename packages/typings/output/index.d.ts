import { Table } from '@/typings/components/Table';
import { Report } from '@/typings/command';
import { Context } from '@/typings/context';
import { CliOutputOptions } from '@/typings/output/cli';

export interface FileWriteStartEvent {
  contents: string;
  context: Context;
  file: string;
  type: string;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface FileWriteEndEvent extends FileWriteStartEvent {}

export interface CliReportStartEvent {
  context: Context;
  cliOptions: CliOutputOptions;
  report: Report;
}

export interface CliReportEndEvent {
  context: Context;
  report: Report;
  table: Table | void;
}

export interface CliWriteStartEvent {
  context: Context;
  report: Report;
  table: Table | void;
}

export interface CliWriteEndEvent extends CliWriteStartEvent {
  contents: string;
}

export interface HtmlReportStartEvent {
  context: Context;
  file: string;
  report: Report;
}

export interface HtmlReportEndEvent extends HtmlReportStartEvent {
  contents: string;
}

export interface JsonReportStartEvent {
  context: Context;
  file: string;
  report: Report;
}

export interface JsonReportEndEvent extends JsonReportStartEvent {
  contents: string;
}

export interface MarkdownReportStartEvent {
  context: Context;
  file: string;
  report: Report;
}

export interface MarkdownReportEndEvent extends MarkdownReportStartEvent {
  contents: string;
}

export interface OutputItemObject {
  onlyFailures?: boolean;
  path: string;
}

export type OutputItem = string | OutputItemObject;

export type OutputFn = (report: Report, context: Context, location: string) => Promise<void>;
