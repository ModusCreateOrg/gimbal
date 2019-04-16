import path from 'path';
import { CommandOptions } from '@/typings/utils/command';
import { mkdirp } from '@/utils/fs';
import log from '@/utils/logger';
import htmlOutput from './html';
import jsonOutput from './json';
import markdownOutput from './markdown';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const output = async (data: any, commandOptions: CommandOptions): Promise<void> => {
  if (commandOptions.outputHtml) {
    await mkdirp(path.dirname(commandOptions.outputHtml));

    await htmlOutput(commandOptions.outputHtml, data);

    log(`HTML report written to: ${commandOptions.outputHtml}`);
  }

  if (commandOptions.outputJson) {
    await mkdirp(path.dirname(commandOptions.outputJson));

    await jsonOutput(commandOptions.outputJson, data);

    log(`JSON report written to: ${commandOptions.outputJson}`);
  }

  if (commandOptions.outputMarkdown) {
    await mkdirp(path.dirname(commandOptions.outputMarkdown));

    await markdownOutput(commandOptions.outputMarkdown, data);

    log(`Markdown report written to: ${commandOptions.outputMarkdown}`);
  }
};

export default output;
