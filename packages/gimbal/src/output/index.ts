import Logger from '@modus/gimbal-core/lib/logger';
import { mkdirp, resolvePath, writeFile } from '@modus/gimbal-core/lib/utils/fs';
import path from 'path';
import EventEmitter from '@/event';
import { Report } from '@/typings/command';
import { Context } from '@/typings/context';
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

const writeReport = async (file: string, type: string, contents: string, context: Context): Promise<boolean> => {
  try {
    const fileWriteStartEvent: FileWriteStartEvent = {
      contents,
      context,
      file,
      type,
    };

    await EventEmitter.fire('output/file/write/start', fileWriteStartEvent);

    await writeFile(file, contents, 'utf8');

    const fileWriteEndEvent: FileWriteEndEvent = {
      contents,
      context,
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

const doCliOutput = async (report: Report, context: Context): Promise<void> => {
  const cliOptions: CliOutputOptions = {};

  const cliReportStartEvent: CliReportStartEvent = {
    cliOptions,
    context,
    report,
  };

  await EventEmitter.fire('output/cli/report/start', cliReportStartEvent);

  const table = outputTable(report, context, cliOptions);

  const cliReportEndEvent: CliReportEndEvent = {
    context,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/report/end', cliReportEndEvent);

  const cliWriteStartEvent: CliWriteStartEvent = {
    context,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/report/start', cliWriteStartEvent);

  const cliContents = await table.render('cli');

  Logger.log(cliContents);

  const cliWriteEndEvent: CliWriteEndEvent = {
    contents: cliContents,
    context,
    report,
    table,
  };

  await EventEmitter.fire('output/cli/write/end', cliWriteEndEvent);
};

const doHtmlOutput: OutputFn = async (report: Report, context: Context, html: string): Promise<void> => {
  const file = html ? resolvePath(context.config.get('configs.cwd'), html) : context.config.get('configs.outputHtml');

  if (file) {
    await mkdirp(path.dirname(file));

    const htmlReportStartEvent: HtmlReportStartEvent = {
      context,
      file,
      report,
    };

    await EventEmitter.fire('output/html/report/start', htmlReportStartEvent);

    const contents = await htmlOutput(report, context);

    const htmlReportEndEvent: HtmlReportEndEvent = {
      contents,
      context,
      file,
      report,
    };

    await EventEmitter.fire('output/html/report/end', htmlReportEndEvent);

    await writeReport(file, 'HTML', contents, context);
  }
};

const doJsonOutput: OutputFn = async (report: Report, context: Context, json: string): Promise<void> => {
  const file = json ? resolvePath(context.config.get('configs.cwd'), json) : context.config.get('configs.outputJson');

  if (file) {
    await mkdirp(path.dirname(file));

    const jsonReportStartEvent: JsonReportStartEvent = {
      context,
      file,
      report,
    };

    await EventEmitter.fire('output/json/report/start', jsonReportStartEvent);

    const contents = jsonOutput(report);

    const jsonReportEndEvent: JsonReportEndEvent = {
      contents,
      context,
      file,
      report,
    };

    await EventEmitter.fire('output/json/report/end', jsonReportEndEvent);

    await writeReport(file, 'JSON', contents, context);
  }
};

const doMarkdownOutput: OutputFn = async (report: Report, context: Context, markdown: string): Promise<void> => {
  const file = markdown
    ? resolvePath(context.config.get('configs.cwd'), markdown)
    : context.config.get('configs.outputMarkdown');

  if (file) {
    await mkdirp(path.dirname(file));

    const markdownReportStartEvent: MarkdownReportStartEvent = {
      context,
      file,
      report,
    };

    await EventEmitter.fire('output/markdown/report/start', markdownReportStartEvent);

    const contents = await markdownOutput(report, context);

    const markdownReportEndEvent: MarkdownReportEndEvent = {
      contents,
      context,
      file,
      report,
    };

    await EventEmitter.fire('output/markdown/report/end', markdownReportEndEvent);

    await writeReport(file, 'Markdown', contents, context);
  }
};

const doOutput = async (report: Report, context: Context, outputItem: OutputItem, fn: OutputFn): Promise<void> => {
  const location = typeof outputItem === 'string' ? outputItem : outputItem.path;

  if (outputItem && (outputItem as OutputItemObject).onlyFailures) {
    if (!report.success) {
      const filteredReport = returnReportFailures(report);

      await fn(filteredReport, context, location);
    }
  } else {
    await fn(report, context, location);
  }
};

const output = async (report: Report, context: Context): Promise<void> => {
  const { cli, html, json, markdown } = context.config.get('outputs', {});

  if (cli !== false) {
    if (cli && cli.onlyFailures) {
      if (!report.success) {
        const filteredReport = returnReportFailures(report);

        await doCliOutput(filteredReport, context);
      }
    } else {
      await doCliOutput(report, context);
    }
  }

  if (html || context.config.get('configs.outputHtml')) {
    await doOutput(report, context, html, doHtmlOutput);
  }

  if (json || context.config.get('configs.outputJson')) {
    await doOutput(report, context, json, doJsonOutput);
  }

  if (markdown || context.config.get('configs.outputMarkdown')) {
    await doOutput(report, context, markdown, doMarkdownOutput);
  }
};

export default output;
