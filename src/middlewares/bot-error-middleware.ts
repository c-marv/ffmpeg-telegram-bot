import {Middleware, Context} from 'telegraf';
import {Update} from 'telegraf/typings/core/types/typegram';
import {IBotMiddleware} from '../interfaces';

export class BotErrorMiddleware implements IBotMiddleware {
  handler(): Middleware<Context<Update>> {
    return async (context: Context, next) => {
      try {
        await next();
      } catch (err: unknown) {
        await context.deleteMessage();
        console.log('Error', err);
        await context.reply(`ERROR: ${err}`);
      }
    };
  }
}
