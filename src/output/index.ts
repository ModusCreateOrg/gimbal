import path from 'path';
import Config from '@/config';
import { CommandReturn } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { mkdirp, resolvePath } from '@/utils/fs';
import log from '@/utils/logger';
import htmlOutput from './html';
import jsonOutput from './json';
import markdownOutput from './markdown';

const output = async (report: CommandReturn, commandOptions: CommandOptions): Promise<void> => {
  const { html, json, markdown } = Config.get('outputs', {});

  if (html || commandOptions.outputHtml) {
    const file = html ? resolvePath(commandOptions.cwd, html) : commandOptions.outputHtml;

    if (file) {
      await mkdirp(path.dirname(file));

      await htmlOutput(file, report.data);

      log(`HTML report written to: ${file}`);
    }
  }

  if (json || commandOptions.outputJson) {
    const file = json ? resolvePath(commandOptions.cwd, json) : commandOptions.outputJson;

    if (file) {
      await mkdirp(path.dirname(file));

      await jsonOutput(file, report.data);

      log(`JSON report written to: ${file}`);
    }
  }

  if (markdown || commandOptions.outputMarkdown) {
    const file = markdown ? resolvePath(commandOptions.cwd, markdown) : commandOptions.outputMarkdown;

    if (file) {
      await mkdirp(path.dirname(file));

      await markdownOutput(file, report.data);

      log(`Markdown report written to: ${file}`);
    }
  }
};

export default output;
