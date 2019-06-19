import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

export interface Options {
  commandOptions: CommandOptions;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [name: string]: any; // any to allow anything else to be on this options object
}

export type Module = (options: Options) => Promise<Report>;

export type Get = (name: string) => Module | void;

export type Register = (name: string, fn: Module) => void;
