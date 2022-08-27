import path from 'path';
import {ShellUtils} from '.';
import {v4 as uuidv4} from 'uuid';
import {FILE_FORMATS, SUPPORTED_FILE_FORMATS} from '../constants';

export class FfmpegUtils {
  static async check(): Promise<boolean> {
    try {
      await ShellUtils.exec('ffmpeg -version');
      return true;
    } catch (err) {
      return false;
    }
  }

  static async convert(filePath: string, format: string): Promise<string> {
    if (!SUPPORTED_FILE_FORMATS.includes(format)) {
      throw new Error(`Format ${format} not supported`);
    }
    let additionalCommandParameters = '';
    if (format === FILE_FORMATS.GIF) {
      additionalCommandParameters = '-c:v copy -an';
    }

    const newFilePath = path.resolve(
      __dirname,
      '../../tmp',
      `${uuidv4()}.${format === FILE_FORMATS.GIF ? FILE_FORMATS.MP4 : format}`
    );

    try {
      await ShellUtils.exec(
        `ffmpeg -i ${filePath} ${additionalCommandParameters} ${newFilePath}`
      );
      return newFilePath;
    } catch (err) {
      throw new Error('Error converting file');
    }
  }
}
