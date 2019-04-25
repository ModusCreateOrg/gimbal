const LOCALHOST_RE = /^(?:http:\/\/localhost):?\d*\/?/;
const IS_LOCALHOST_RE = /^(?:http:\/\/localhost):?\d*\/?$/;

/* eslint-disable-next-line import/prefer-default-export */
export const pad = (amount: number, character: string = ' '): string => new Array(amount).fill(character).join('');
export const splitOnWhitespace = (str: string): string[] => str.trim().split(/\s+/);
export const truncatePath = (path: string, cwd: string = ''): string =>
  path.match(IS_LOCALHOST_RE) ? path : `...${path.replace(LOCALHOST_RE, '').replace(cwd, '')}`;
