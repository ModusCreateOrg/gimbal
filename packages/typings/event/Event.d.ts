import { Data } from '@/typings/utils/Queue';

export type Callback = (event: string, data: Data) => Data | void;

export type CreatedCallback = (data: Data) => Data | void;

export type CreateCallback = (event: string) => CreatedCallback;

export type Fire = (event: string, data: Data) => Data;

export interface Config {
  fn: Callback;
  priority?: number;
}

export interface Event {
  priority: number;
  fire: Fire;
  createCallback: CreateCallback;
}
