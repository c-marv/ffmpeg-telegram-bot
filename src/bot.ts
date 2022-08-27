import {Telegraf} from 'telegraf';
import {IBot, IBotCommand, IBotMiddleware} from './interfaces';

export class Bot implements IBot {
  private botClient: Telegraf;
  private botToken: string;
  constructor(botToken: string) {
    this.botToken = botToken;
    this.botClient = new Telegraf(botToken);
  }

  command(command: IBotCommand): void {
    if (command.getCommand() === 'start') {
      this.botClient.start(command.handler());
      return;
    }
    this.botClient.command(command.getCommand(), command.handler());
  }

  commands(commands: IBotCommand[]): void {
    commands.forEach((command: IBotCommand) => this.command(command));
  }

  getToken(): string {
    return this.botToken;
  }

  middlewares(middlewares: IBotMiddleware[]): void {
    middlewares.forEach((middleware: IBotMiddleware) =>
      this.middleware(middleware)
    );
  }

  middleware(middleware: IBotMiddleware): void {
    this.botClient.use(middleware.handler());
  }

  start(): void {
    this.botClient.launch();
    process.once('SIGINT', () => this.botClient.stop('SIGINT'));
    process.once('SIGTERM', () => this.botClient.stop('SIGTERM'));
  }

  getClient(): Telegraf {
    return this.botClient;
  }
}
