import { Context, Middleware } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export interface IBotMiddleware {
  handler(): Middleware<Context<Update>>;
}
