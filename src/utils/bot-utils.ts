export class BotUtils {
  static parseCommand(message: string): string[] {
    const params = message.split(/ +/);
    if (params.length < 2 || params.length > 3) {
      throw new Error(
        'You must pass the command and the url, eg: /mp4 https://foo.bar/baz.webm [quality]'
      );
    }
    return params;
  }
}
