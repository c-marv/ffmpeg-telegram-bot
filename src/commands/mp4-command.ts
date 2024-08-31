import {Middleware, Context} from 'telegraf';
import {Update} from 'telegraf/typings/core/types/typegram';
import {FILE_FORMATS} from '../constants';
import {IBotCommand} from '../interfaces';
import {TelegramMessage} from '../types';
import {FileUtils} from '../utils';
import {BaseConvertCommand} from './base-convert-command';

export class Mp4Command extends BaseConvertCommand implements IBotCommand {
  getCommand(): string {
    return FILE_FORMATS.MP4;
  }
  handler(): Middleware<Context<Update>> {
    return async context => {
      const message = context.message as TelegramMessage;
      if (!message) return;
      const filePath = await this.convert(message.text, FILE_FORMATS.MP4);
      await context.replyWithVideo({
        source: filePath,
      });
      await FileUtils.delete(filePath);
    };
  }
}
