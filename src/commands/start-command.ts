import {Middleware, Context} from 'telegraf';
import {Update} from 'telegraf/typings/core/types/typegram';
import {IBotCommand} from '../interfaces';

export class StartCommand implements IBotCommand {
  getCommand(): string {
    return 'start';
  }
  handler(): Middleware<Context<Update>> {
    return async (context: Context) => {
      return await context.reply(
        `Welcome ${context.from?.first_name} to ffmpeg bot!`
      );
    };
  }
}
