import {Middleware, Context} from 'telegraf';
import {FILE_FORMATS} from '../constants';
import {IBotCommand} from '../interfaces';
import {TelegramMessage} from '../types';
import {FileUtils} from '../utils';
import {BaseConvertCommand} from './base-convert-command';

export class JpgCommand extends BaseConvertCommand implements IBotCommand {
  getCommand(): string {
    return FILE_FORMATS.JPG;
  }

  handler(): Middleware<Context> {
    return async context => {
      const message = context.message as TelegramMessage;
      if (!message) return;
      const filePath = await this.convert(message.text, this.getCommand());
      await context.replyWithPhoto({source: filePath});
      await FileUtils.delete(filePath);
    };
  }
}
