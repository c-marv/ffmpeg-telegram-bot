import {RequestHandler} from 'express';
import {IBot, IServerMiddleware} from '../interfaces';

export class ServerWebhookCallbackMiddleware implements IServerMiddleware {
  private bot: IBot;
  public constructor(bot: IBot) {
    this.bot = bot;
  }
  handler(): RequestHandler {
    return this.bot.getClient().webhookCallback(`/bot${this.bot.getToken()}`);
  }
}
