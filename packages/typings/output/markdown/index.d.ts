import { Report } from '@/typings/command';
import { Table } from '@/typings/components/Table';
import { Context } from '@/typings/context';
import { CliOutputOptions } from '@/typings/output/cli';

export interface MarkdownRenderTableStartEvent {
  context: Context;
  options?: CliOutputOptions;
  report: Report;
  table: Table;
}

export interface MarkdownRenderTableEndEvent extends MarkdownRenderTableStartEvent {
  markdown: string;
}
