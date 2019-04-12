/* eslint-disable-next-line import/prefer-default-export */
export interface CommandOptions {
  config: string;
  cwd: string;
  [name: string]: string | number | boolean;
}
