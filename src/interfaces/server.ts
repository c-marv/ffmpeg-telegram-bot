import { Express } from 'express';
import { IServerMiddleware } from './middlewares';
export interface IServer {
  use(middleware: IServerMiddleware): void;
  start(): void;
  getExpressServer(): Express;
}
