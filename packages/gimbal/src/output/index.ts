import { mkdirp, resolvePath, writeFile } from '@modus/gimbal-core/lib/utils/fs';
import { ParsedArgs } from 'minimist';
import path from 'path';
import Config from '@/config';
import EventEmitter from '@/event';
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
  OutputFn,
  OutputItemObject,
  OutputItem,
} from '@/typings/output';
import { CliOutputOptions } from '@/typings/output/cli';
import { outputTable } from './cli';
import htmlOutput from './html';
import jsonOutput from './json';
import markdownOutput from './markdown';
import { returnReportFailures } from './filter';

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

const doCliOutput = async (report: Report, args: ParsedArgs): Promise<void> => {
  const cliOptions: CliOutputOptions = {};

  const cliReportStartEvent: CliReportStartEvent = {
    args,
    cliOptions,
    report,
  };

  await EventEmitter.fire('output/cli/report/start', cliReportStartEvent);

  const table = outputTable(report, args, cliOptions);

  const cliReportEndEvent: CliReportEndEvent = {
    args,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/report/end', cliReportEndEvent);

  const cliWriteStartEvent: CliWriteStartEvent = {
    args,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/report/start', cliWriteStartEvent);

  const cliContents = await table.render('cli');

  Logger.log(cliContents);

  const cliWriteEndEvent: CliWriteEndEvent = {
    args,
    contents: cliContents,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/write/end', cliWriteEndEvent);
};

const doHtmlOutput: OutputFn = async (report: Report, args: ParsedArgs, html: string): Promise<void> => {
  const file = html ? resolvePath(args.cwd, html) : args.outputHtml;

  if (file) {
    await mkdirp(path.dirname(file));

    const htmlReportStartEvent: HtmlReportStartEvent = {
      args,
      file,
      report,
    };

    await EventEmitter.fire('output/html/report/start', htmlReportStartEvent);

    const contents = await htmlOutput(report, args);

    const htmlReportEndEvent: HtmlReportEndEvent = {
      args,
      contents,
      file,
      report,
    };

    await EventEmitter.fire('output/html/report/end', htmlReportEndEvent);

    await writeReport(file, 'HTML', contents);
  }
};

const doJsonOutput: OutputFn = async (report: Report, args: ParsedArgs, json: string): Promise<void> => {
  const file = json ? resolvePath(args.cwd, json) : args.outputJson;

  if (file) {
    await mkdirp(path.dirname(file));

    const jsonReportStartEvent: JsonReportStartEvent = {
      args,
      file,
      report,
    };

    await EventEmitter.fire('output/json/report/start', jsonReportStartEvent);

    const contents = jsonOutput(report);

    const jsonReportEndEvent: JsonReportEndEvent = {
      args,
      contents,
      file,
      report,
    };

    await EventEmitter.fire('output/json/report/end', jsonReportEndEvent);

    await writeReport(file, 'JSON', contents);
  }
};

const doMarkdownOutput: OutputFn = async (report: Report, args: ParsedArgs, markdown: string): Promise<void> => {
  const file = markdown ? resolvePath(args.cwd, markdown) : args.outputMarkdown;

  if (file) {
    await mkdirp(path.dirname(file));

    const markdownReportStartEvent: MarkdownReportStartEvent = {
      args,
      file,
      report,
    };

    await EventEmitter.fire('output/markdown/report/start', markdownReportStartEvent);

    const contents = await markdownOutput(report, args);

    const markdownReportEndEvent: MarkdownReportEndEvent = {
      args,
      contents,
      file,
      report,
    };

    await EventEmitter.fire('output/markdown/report/end', markdownReportEndEvent);

    await writeReport(file, 'Markdown', contents);
  }
};

const doOutput = async (report: Report, args: ParsedArgs, outputItem: OutputItem, fn: OutputFn): Promise<void> => {
  const location = typeof outputItem === 'string' ? outputItem : outputItem.path;

  if (outputItem && (outputItem as OutputItemObject).onlyFailures) {
    if (!report.success) {
      const filteredReport = returnReportFailures(report);

      await fn(filteredReport, args, location);
    }
  } else {
    await fn(report, args, location);
  }
};

const output = async (report: Report, args: ParsedArgs): Promise<void> => {
  const { cli, html, json, markdown } = Config.get('outputs', {});

  if (cli !== false) {
    if (cli && cli.onlyFailures) {
      if (!report.success) {
        const filteredReport = returnReportFailures(report);

        await doCliOutput(filteredReport, args);
      }
    } else {
      await doCliOutput(report, args);
    }
  }

  if (html || args.outputHtml) {
    await doOutput(report, args, html, doHtmlOutput);
  }

  if (json || args.outputJson) {
    await doOutput(report, args, json, doJsonOutput);
  }

  if (markdown || args.outputMarkdown) {
    await doOutput(report, args, markdown, doMarkdownOutput);
  }
};

export default output;
