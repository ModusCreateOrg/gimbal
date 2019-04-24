const LOCALHOST_RE = /(?:http:\/\/localhost):?\d*\/?$/;

/* eslint-disable-next-line import/prefer-default-export */
export const pad = (amount: number, character: string = ' '): string => new Array(amount).fill(character).join('');
export const splitOnWhitespace = (str: string): string[] => str.trim().split(/\s+/);
export const truncatePath = (path: string, cwd: string = ''): string =>
  LOCALHOST_RE.test(path) ? path : `...${path.replace(LOCALHOST_RE, '').replace(cwd, '')}`;
