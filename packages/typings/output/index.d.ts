import { Table } from '@/typings/components/Table';
import { Report } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';

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
  commandOptions: CommandOptions;
  cliOptions: CliOutputOptions;
  report: Report;
}

export interface CliReportEndEvent {
  commandOptions: CommandOptions;
  report: Report;
  table: Table | void;
}

export interface CliWriteStartEvent {
  commandOptions: CommandOptions;
  report: Report;
  table: Table | void;
}

export interface CliWriteEndEvent {
  commandOptions: CommandOptions;
  contents: string;
  report: Report;
  table: Table | void;
}

export interface HtmlReportStartEvent {
  commandOptions: CommandOptions;
  file: string;
  report: Report;
}

export interface HtmlReportEndEvent {
  commandOptions: CommandOptions;
  contents: string;
  file: string;
  report: Report;
}

export interface JsonReportStartEvent {
  commandOptions: CommandOptions;
  file: string;
  report: Report;
}

export interface JsonReportEndEvent {
  commandOptions: CommandOptions;
  contents: string;
  file: string;
  report: Report;
}

export interface MarkdownReportStartEvent {
  commandOptions: CommandOptions;
  file: string;
  report: Report;
}

export interface MarkdownReportEndEvent {
  commandOptions: CommandOptions;
  contents: string;
  file: string;
  report: Report;
}
