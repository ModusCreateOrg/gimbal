import deepmerge from 'deepmerge';
import { existsSync } from 'fs';
import http from 'http';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import handler from 'serve-handler';
import Config from '@/config';
import EventEmitter from '@/event';
import {
  CloseStartEvent,
  CloseEndEvent,
  CreateServerStartEvent,
  CreateServerEndEvent,
  ListenStartEvent,
  ListenEndEvent,
} from '@/typings/module/serve';

interface ServeOptions {
  port: number;
  public: string;
}

class Serve {
  private port: number;

  private public: string;

  private server?: http.Server;

  public constructor(options: ServeOptions) {
    this.port = options.port;
    this.public = options.public;
  }

  public start(): Promise<void> {
    return new Promise(
      /* eslint-disable-next-line no-async-promise-executor */
      async (resolve): Promise<void> => {
        const { port, public: dir } = this;

        if (!existsSync(dir)) {
          throw new Error(`Cannot host nonexistent directory: ${dir}`);
        }

        const createServerStartEvent: CreateServerStartEvent = {
          dir,
          mod: this,
          port,
        };

        await EventEmitter.fire(`module/serve/create-server/start`, createServerStartEvent);

        const handlerOptions = deepmerge(Config.get('configs.serve', {}), {
          public: dir,
        });

        const server = http.createServer((request, response): void => handler(request, response, handlerOptions));

        const createServerEndEvent: CreateServerEndEvent = {
          dir,
          mod: this,
          port,
          server,
        };

        await EventEmitter.fire(`module/serve/create-server/end`, createServerEndEvent);

        this.server = server;

        const listenStartEvent: ListenStartEvent = {
          dir,
          mod: this,
          port,
          server,
        };

        await EventEmitter.fire(`module/serve/listen/start`, listenStartEvent);

        server.listen(
          port,
          async (): Promise<void> => {
            const listenEndEvent: ListenEndEvent = {
              dir,
              mod: this,
              port,
              server,
            };

            await EventEmitter.fire(`module/serve/listen/end`, listenEndEvent);

            resolve();
          },
        );
      },
    );
  }

  public stop(): Promise<void> {
    return new Promise(
      /* eslint-disable-next-line no-async-promise-executor */
      async (resolve): Promise<void> => {
        const { server } = this;

        if (server) {
          const closeStartEvent: CloseStartEvent = {
            mod: this,
            server,
          };

          await EventEmitter.fire(`module/serve/close/start`, closeStartEvent);

          server.close(
            async (): Promise<void> => {
              const closeEndEvent: CloseEndEvent = {
                mod: this,
              };

              await EventEmitter.fire(`module/serve/close/end`, closeEndEvent);

              this.server = undefined;

              resolve();
            },
          );
        } else {
          resolve();
        }
      },
    );
  }
}

export default Serve;
