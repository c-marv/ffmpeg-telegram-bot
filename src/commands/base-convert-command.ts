import {BotUtils, FfmpegUtils, FileUtils, UrlUtils} from '../utils';

export abstract class BaseConvertCommand {
  async convert(message: string, format: string, quality?: string): Promise<string> {
    const [, url] = BotUtils.parseCommand(message);
    if (!UrlUtils.isValid(url)) throw new Error('Invalid url');
    console.log(`Converting url ${url} to format ${format}${quality ? ` at quality ${quality}` : ''}`);
    const filePath = await UrlUtils.download(url, quality);
    console.log(`File has been downloaded successfully ${filePath}`);
    const newFilePath = await FfmpegUtils.convert(filePath, format);
    console.log(`File has been converted to ${format} successfully`);
    await FileUtils.delete(filePath);
    console.log(`Temporal downloaded file has been deleted ${filePath}`);
    return newFilePath;
  }
}
