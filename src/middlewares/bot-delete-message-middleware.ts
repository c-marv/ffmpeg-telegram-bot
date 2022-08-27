import {Middleware, Context} from 'telegraf';
import {Update} from 'telegraf/typings/core/types/typegram';
import {IBotMiddleware} from '../interfaces';

export class BotDeleteMessageMiddleware implements IBotMiddleware {
  handler(): Middleware<Context<Update>> {
    return async (context, next) => {
      await next();
      await context.deleteMessage();
    };
  }
}
