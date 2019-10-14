import { Table } from '@/typings/components/Table';
import { Report } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';
import { ParsedArgs } from 'minimist';

export interface FileWriteStartEvent {
  contents: string;
  file: string;
  type: string;
}

export interface FileWriteEndEvent {
  contents: string;
  file: string;
  type: string;
}

export interface CliReportStartEvent {
  args: ParsedArgs;
  cliOptions: CliOutputOptions;
  report: Report;
}

export interface CliReportEndEvent {
  args: ParsedArgs;
  report: Report;
  table: Table | void;
}

export interface CliWriteStartEvent {
  args: ParsedArgs;
  report: Report;
  table: Table | void;
}

export interface CliWriteEndEvent extends CliWriteStartEvent {
  contents: string;
}

export interface HtmlReportStartEvent {
  args: ParsedArgs;
  file: string;
  report: Report;
}

export interface HtmlReportEndEvent extends HtmlReportStartEvent {
  contents: string;
}

export interface JsonReportStartEvent {
  args: ParsedArgs;
  file: string;
  report: Report;
}

export interface JsonReportEndEvent extends JsonReportStartEvent {
  contents: string;
}

export interface MarkdownReportStartEvent {
  args: ParsedArgs;
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

export type OutputFn = (report: Report, args: ParsedArgs, location: string) => Promise<void>;
