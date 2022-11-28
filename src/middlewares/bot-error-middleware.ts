import {Middleware, Context} from 'telegraf';
import {Update} from 'telegraf/typings/core/types/typegram';
import {IBotMiddleware} from '../interfaces';

export class BotErrorMiddleware implements IBotMiddleware {
  handler(): Middleware<Context<Update>> {
    return async (context: Context, next) => {
      let catchedError: unknown;
      try {
        await next();
      } catch (err: unknown) {
        catchedError = err;
        console.log('Unhandled Error', err);
      }
      if (catchedError) {
        try {
          await context.reply(`Error: ${catchedError}`);
        } catch (err: unknown) {
          console.log(
            `Error tying to reply to ${context.message?.from.username}`,
            err
          );
        }
      }
    };
  }
}
