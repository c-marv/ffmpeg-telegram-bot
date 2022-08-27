import {Telegraf} from 'telegraf';
import {IBotCommand} from './bot-command';
import {IBotMiddleware} from './middlewares/bot-middleware';

export interface IBot {
  middlewares(middlewares: IBotMiddleware[]): void;
  middleware(middleware: IBotMiddleware): void;
  command(command: IBotCommand): void;
  commands(commands: IBotCommand[]): void;
  start(): void;
  getClient(): Telegraf;
  getToken(): string;
}
