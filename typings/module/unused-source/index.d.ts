import { CoverageEntry } from 'puppeteer';

export interface CoverageRange {
  end: number;
  start: number;
}

export interface Entry extends CoverageEntry {
  total: number;
  used: number;
}

export interface UnusedRet {
  css: Entry[];
  js: Entry[];
  total: number;
  used: number;
}
