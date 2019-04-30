import marked from 'marked';
import path from 'path';
import generateMarkdown from '@/output/markdown';
import { Report } from '@/typings/command';
import { readFile } from '@/utils/fs';

const HtmlOutput = async (report: Report): Promise<string> => {
  const markdown = generateMarkdown(report);
  const html = marked(markdown);
  const template = await readFile(path.join(__dirname, 'template.html'), 'utf8');

  return template.replace('{%body%}', html);
};

export default HtmlOutput;
