import path from 'path';
import Config from '@modus/gimbal-core/lib/config';
import EventEmitter from '@modus/gimbal-core/lib/event';
import { mkdirp, resolvePath, writeFile } from '@modus/gimbal-core/lib/utils/fs';
import Logger from '@/logger';
import { Report } from '@/typings/command';
import {
  FileWriteStartEvent,
  FileWriteEndEvent,
  CliReportStartEvent,
  CliReportEndEvent,
  CliWriteStartEvent,
  CliWriteEndEvent,
  HtmlReportStartEvent,
  HtmlReportEndEvent,
  JsonReportStartEvent,
  JsonReportEndEvent,
  MarkdownReportStartEvent,
  MarkdownReportEndEvent,
} from '@/typings/output';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';
import { outputTable } from './cli';
import htmlOutput from './html';
import jsonOutput from './json';
import markdownOutput from './markdown';

const writeReport = async (file: string, type: string, contents: string): Promise<boolean> => {
  try {
    const fileWriteStartEvent: FileWriteStartEvent = {
      contents,
      file,
      type,
    };

    await EventEmitter.fire('output/file/write/start', fileWriteStartEvent);

    await writeFile(file, contents, 'utf8');

    const fileWriteEndEvent: FileWriteEndEvent = {
      contents,
      file,
      type,
    };

    await EventEmitter.fire('output/file/write/end', fileWriteEndEvent);

    Logger.log(`${type} report written to: ${file}`);

    return true;
  } catch {
    Logger.log(`${type} report could not be written to: ${file}`);

    return false;
  }
};

const doCliOutput = async (report: Report, commandOptions: CommandOptions): Promise<void> => {
  const cliOptions: CliOutputOptions = {};

  const cliReportStartEvent: CliReportStartEvent = {
    commandOptions,
    cliOptions,
    report,
  };

  await EventEmitter.fire('output/cli/report/start', cliReportStartEvent);

  const table = outputTable(report, commandOptions, cliOptions);

  const cliReportEndEvent: CliReportEndEvent = {
    commandOptions,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/report/end', cliReportEndEvent);

  const cliWriteStartEvent: CliWriteStartEvent = {
    commandOptions,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/report/start', cliWriteStartEvent);

  const cliContents = table.render('cli');

  Logger.log(cliContents);

  const cliWriteEndEvent: CliWriteEndEvent = {
    commandOptions,
    contents: cliContents,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/write/end', cliWriteEndEvent);
};

const doHtmlOutput = async (report: Report, commandOptions: CommandOptions, html: string): Promise<void> => {
  const file = html ? resolvePath(commandOptions.cwd, html) : commandOptions.outputHtml;

  if (file) {
    await mkdirp(path.dirname(file));

    const htmlReportStartEvent: HtmlReportStartEvent = {
      commandOptions,
      file,
      report,
    };

    await EventEmitter.fire('output/html/report/start', htmlReportStartEvent);

    const contents = await htmlOutput(report, commandOptions);

    const htmlReportEndEvent: HtmlReportEndEvent = {
      commandOptions,
      contents,
      file,
      report,
    };

    await EventEmitter.fire('output/html/report/end', htmlReportEndEvent);

    await writeReport(file, 'HTML', contents);
  }
};

const doJsonOutput = async (report: Report, commandOptions: CommandOptions, json: string): Promise<void> => {
  const file = json ? resolvePath(commandOptions.cwd, json) : commandOptions.outputJson;

  if (file) {
    await mkdirp(path.dirname(file));

    const jsonReportStartEvent: JsonReportStartEvent = {
      commandOptions,
      file,
      report,
    };

    await EventEmitter.fire('output/json/report/start', jsonReportStartEvent);

    const contents = jsonOutput(report);

    const jsonReportEndEvent: JsonReportEndEvent = {
      commandOptions,
      contents,
      file,
      report,
    };

    await EventEmitter.fire('output/json/report/end', jsonReportEndEvent);

    await writeReport(file, 'JSON', contents);
  }
};

const doMarkdownOutput = async (report: Report, commandOptions: CommandOptions, markdown: string): Promise<void> => {
  const file = markdown ? resolvePath(commandOptions.cwd, markdown) : commandOptions.outputMarkdown;

  if (file) {
    await mkdirp(path.dirname(file));

    const markdownReportStartEvent: MarkdownReportStartEvent = {
      commandOptions,
      file,
      report,
    };

    await EventEmitter.fire('output/markdown/report/start', markdownReportStartEvent);

    const contents = await markdownOutput(report, commandOptions);

    const markdownReportEndEvent: MarkdownReportEndEvent = {
      commandOptions,
      contents,
      file,
      report,
    };

    await EventEmitter.fire('output/markdown/report/end', markdownReportEndEvent);

    await writeReport(file, 'Markdown', contents);
  }
};

const output = async (report: Report, commandOptions: CommandOptions): Promise<void> => {
  const { cli, html, json, markdown } = Config.get('outputs', {});

  if (cli !== false) {
    await doCliOutput(report, commandOptions);
  }

  if (html || commandOptions.outputHtml) {
    await doHtmlOutput(report, commandOptions, html);
  }

  if (json || commandOptions.outputJson) {
    await doJsonOutput(report, commandOptions, json);
  }

  if (markdown || commandOptions.outputMarkdown) {
    await doMarkdownOutput(report, commandOptions, markdown);
  }
};

export default output;
