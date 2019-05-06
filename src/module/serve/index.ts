import { existsSync } from 'fs';
import http from 'http';
// @ts-ignore
import handler from 'serve-handler';

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
      (resolve): void => {
        if (!existsSync(this.public)) {
          throw new Error(`Cannot host nonexistent directory: ${this.public}`);
        }

        const server = http.createServer(
          (request, response): void =>
            handler(request, response, {
              public: this.public,
            }),
        );

        this.server = server;

        server.listen(
          this.port,
          (): void => {
            resolve();
          },
        );
      },
    );
  }

  public stop(): Promise<void> {
    return new Promise(
      (resolve): void => {
        const { server } = this;

        if (server) {
          server.close(
            (): void => {
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
