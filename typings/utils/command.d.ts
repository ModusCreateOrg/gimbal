/* eslint-disable-next-line import/prefer-default-export */
export interface CommandOptions {
  cwd: string;
  outputHtml?: string;
  outputJson?: string;
  outputMarkdown?: string;
  verbose: boolean;
  [name: string]: string | number | boolean | undefined;
}
