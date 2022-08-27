import {
  GifCommand,
  JpgCommand,
  Mp4Command,
  PngCommand,
  StartCommand,
} from './commands';
import {IBot, IServer} from './interfaces';
import {
  BotAuthMiddleware,
  BotDeleteMessageMiddleware,
  BotErrorMiddleware,
  ServerWebhookCallbackMiddleware,
} from './middlewares';

export class Application {
  private bot: IBot;
  private server: IServer;
  private useExpress: boolean;
  private url: string;
  private allowedUsers: string[];
  constructor(
    useExpress: boolean,
    url: string,
    bot: IBot,
    server: IServer,
    allowedUsers: string[]
  ) {
    this.url = url;
    this.useExpress = useExpress;
    this.bot = bot;
    this.server = server;
    this.allowedUsers = allowedUsers;
  }

  start() {
    if (this.useExpress) {
      const token = this.bot.getToken();
      this.bot.getClient().telegram.setWebhook(`${this.url}/bot${token}`);
      this.server.use(new ServerWebhookCallbackMiddleware(this.bot));
    }
    this.bot.middlewares([
      new BotAuthMiddleware(this.allowedUsers),
      new BotErrorMiddleware(),
      new BotDeleteMessageMiddleware(),
    ]);
    this.bot.commands([
      new StartCommand(),
      new JpgCommand(),
      new PngCommand(),
      new Mp4Command(),
      new GifCommand(),
    ]);
    if (this.useExpress) {
      this.server.start();
    } else {
      this.bot.start();
    }
  }
}
