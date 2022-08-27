import { RequestHandler } from 'express';

export interface IServerMiddleware {
  handler(): RequestHandler;
}
