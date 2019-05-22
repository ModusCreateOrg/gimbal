import http from 'http';

export interface CreateServerStartEvent {
  dir: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
  port: number;
}

export interface CreateServerEndEvent {
  dir: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
  port: number;
  server: http.Server;
}

export interface ListenStartEvent {
  dir: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
  port: number;
  server: http.Server;
}

export interface ListenEndEvent {
  dir: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
  port: number;
  server: http.Server;
}

export interface CloseStartEvent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
  server: http.Server;
}

export interface CloseEndEvent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  mod: any; // would cause circular dependency if imported the command class
}
