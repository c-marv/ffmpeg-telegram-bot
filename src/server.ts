import express, {Express} from 'express';

import {IServer, IServerMiddleware} from './interfaces';
import {FfmpegUtils} from './utils';

export class Server implements IServer {
  private expressServer: Express;
  private port: number;
  constructor(port: number) {
    this.expressServer = express();
    this.port = port;
  }

  use(middleware: IServerMiddleware): void {
    this.expressServer.use(middleware.handler());
  }

  start(): void {
    this.expressServer.get('/', async (req, res) => {
      const isFfmpegInstalled = await FfmpegUtils.check();
      res.send(
        `ffmpeg telegram bot status: UP, ffmpeg is installed: ${
          isFfmpegInstalled ? 'YES' : 'NO'
        }`
      );
    });
    this.expressServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  getExpressServer(): Express {
    return this.expressServer;
  }
}
