export interface CommandOptions {
  cwd: string;
  outputHtml?: string;
  outputJson?: string;
  outputMarkdown?: string;
  verbose: boolean;
  [name: string]: string | number | boolean | undefined;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type GetOptionsFromCommand = (cmd?: any, defaults?: any) => CommandOptions;
