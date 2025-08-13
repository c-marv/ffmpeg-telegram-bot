import { Middleware, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { IBotCommand } from '../interfaces';

export class GetCommand implements IBotCommand {
  getCommand(): string {
    return 'get';
  }

  handler(): Middleware<Context<Update>> {
    return async context => {
      const message = context.message;
      if (!message || !('text' in message) || !message.text) {
        await context.reply('Please provide a valid input in the format: <type>:<file_id>');
        return;
      }

      const input = message.text.split(' ')[1];
      if (!input || !input.includes(':')) {
        await context.reply('Invalid format. Use: <type>:<file_id>');
        return;
      }

      const [type, fileId] = input.split(':');

      if (!type || !fileId) {
        await context.reply('Invalid format. Use: <type>:<file_id>');
        return;
      }

      try {
        switch (type) {
          case 'photo':
            await context.replyWithPhoto(fileId);
            break;
          case 'video':
            await context.replyWithVideo(fileId);
            break;
          case 'animation':
            await context.replyWithAnimation(fileId);
            break;
          default:
            await context.reply('Unsupported type. Supported types are: photo, video, animation.');
        }
      } catch (error) {
        await context.reply('Failed to retrieve the media. Please ensure the file ID is correct.');
      }
    };
  }
}
