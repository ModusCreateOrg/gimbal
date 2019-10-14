import { ParsedArgs } from 'minimist';
import { Report } from '@/typings/command';
import { Table } from '@/typings/components/Table';
import { CliOutputOptions } from '@/typings/output/cli';

export interface MarkdownRenderTableStartEvent {
  args: ParsedArgs;
  options?: CliOutputOptions;
  report: Report;
  table: Table;
}

export interface MarkdownRenderTableEndEvent extends MarkdownRenderTableStartEvent {
  markdown: string;
}
