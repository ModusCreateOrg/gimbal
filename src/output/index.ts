import path from 'path';
import Config from '@/config';
import Logger from '@/logger';
import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { mkdirp, resolvePath, writeFile } from '@/utils/fs';
import { outputTable } from './cli';
import htmlOutput from './html';
import jsonOutput from './json';
import markdownOutput from './markdown';

const writeReport = async (file: string, type: string, contents: string): Promise<boolean> => {
  try {
    await writeFile(file, contents, 'utf8');

    Logger.log(`${type} report written to: ${file}`);

    return true;
  } catch {
    Logger.log(`${type} report could not be written to: ${file}`);

    return false;
  }
};

const output = async (report: Report, commandOptions: CommandOptions): Promise<void> => {
  const { html, json, markdown } = Config.get('outputs', {});

  const table = outputTable(report, commandOptions);

  if (table) {
    Logger.log(table.toString());
  }

  if (html || commandOptions.outputHtml) {
    const file = html ? resolvePath(commandOptions.cwd, html) : commandOptions.outputHtml;

    if (file) {
      await mkdirp(path.dirname(file));

      const contents = await htmlOutput(report, commandOptions);

      await writeReport(file, 'HTML', contents);
    }
  }

  if (json || commandOptions.outputJson) {
    const file = json ? resolvePath(commandOptions.cwd, json) : commandOptions.outputJson;

    if (file) {
      await mkdirp(path.dirname(file));

      const contents = await jsonOutput(report);

      await writeReport(file, 'JSON', contents);
    }
  }

  if (markdown || commandOptions.outputMarkdown) {
    const file = markdown ? resolvePath(commandOptions.cwd, markdown) : commandOptions.outputMarkdown;

    if (file) {
      await mkdirp(path.dirname(file));

      const contents = await markdownOutput(report, commandOptions);

      await writeReport(file, 'Markdown', contents);
    }
  }
};

export default output;
