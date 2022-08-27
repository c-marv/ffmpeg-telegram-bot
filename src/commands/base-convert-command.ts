import {BotUtils, FfmpegUtils, FileUtils, UrlUtils} from '../utils';

export abstract class BaseConvertCommand {
  async convert(message: string, format: string): Promise<string> {
    const [, url] = BotUtils.parseCommand(message);
    if (!UrlUtils.isValid(url)) throw new Error('Invalid url');
    const filePath = await UrlUtils.download(url);
    const newFilePath = await FfmpegUtils.convert(filePath, format);
    await FileUtils.delete(filePath);
    return newFilePath;
  }
}
