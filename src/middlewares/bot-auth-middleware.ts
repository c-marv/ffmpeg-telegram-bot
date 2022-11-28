import {Middleware, Context} from 'telegraf';
import {Update} from 'telegraf/typings/core/types/typegram';
import {IBotMiddleware} from '../interfaces';

export class BotAuthMiddleware implements IBotMiddleware {
  private allowedUsers: string[];
  constructor(allowedUsers: string[]) {
    this.allowedUsers = allowedUsers;
  }

  handler(): Middleware<Context<Update>> {
    return async (context: Context, next) => {
      const username = context.from?.username || null;
      if (!username || !this.allowedUsers.includes(username)) {
        console.log(`Unauthorized user is trying to use the bot ${username}`);
        return;
      }
      await next();
      return;
    };
  }
}
