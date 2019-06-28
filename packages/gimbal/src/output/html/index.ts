import marked from 'marked';
import path from 'path';
import { readFile } from '@modus/gimbal-core/lib/utils/fs';
import generateMarkdown from '@/output/markdown';
import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

// use table's html render type when we get to building real html

const HtmlOutput = async (report: Report, options: CommandOptions): Promise<string> => {
  const markdown = await generateMarkdown(report, options);
  const html = marked(markdown);
  const template = await readFile(path.join(__dirname, 'template.html'), 'utf8');

  return template.replace('{%body%}', html);
};

export default HtmlOutput;
