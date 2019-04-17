import fs from 'fs';
import mkdirpMod from 'mkdirp';
import path from 'path';
import { promisify } from 'util';
import getSize from 'get-folder-size';

export const getDirectorySize = promisify(getSize);
export const mkdirp = promisify(mkdirpMod);
export const readDir = promisify(fs.readdir);
export const readFile = promisify(fs.readFile);
export const stats = promisify(fs.stat);
export const writeFile = promisify(fs.writeFile);

export const resolvePath = (...paths: string[]): string => {
  if (paths.length) {
    if (paths[0][0] === '~') {
      return `${process.env.HOME}${paths[0].slice(1)}`;
    }

    return path.resolve(...paths);
  }

  return process.cwd();
};
