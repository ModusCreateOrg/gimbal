import { Report } from '@/typings/command';
import { Table } from '@/typings/components/Table';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';

export interface MarkdownRenderTableStartEvent {
  commandOptions: CommandOptions;
  options?: CliOutputOptions;
  report: Report;
  table: Table;
}

export interface MarkdownRenderTableEndEvent extends MarkdownRenderTableStartEvent {
  markdown: string;
}
