// @ts-ignore
import handler from 'serve-handler';
import http from 'http';

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
