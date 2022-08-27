import {Context, Middleware} from 'telegraf';

export interface IBotCommand {
  getCommand(): string;
  handler(): Middleware<Context>;
}
