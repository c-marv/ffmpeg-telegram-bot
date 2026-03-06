import axios, {AxiosResponse} from 'axios';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
import {ShellUtils} from './shell-utils';

export class UrlUtils {
  static isValid(url: string): boolean {
    if (!url) return false;
    const matchResult = url.match(
      // eslint-disable-next-line no-useless-escape
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    );
    return matchResult !== null && matchResult.length > 0;
  }

  private static isDirectFile(contentType: string): boolean {
    const directTypes = ['video/', 'image/', 'audio/', 'application/octet-stream'];
    return directTypes.some(t => contentType.startsWith(t));
  }

  private static buildYtDlpFormat(quality?: string): string {
    if (!quality || quality === 'best') {
      return 'bestvideo+bestaudio/best';
    }
    const height = parseInt(quality, 10);
    if (!isNaN(height)) {
      return `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;
    }
    return quality;
  }

  private static async downloadWithYtDlp(
    url: string,
    quality?: string
  ): Promise<string> {
    const outputTemplate = path.resolve(
      __dirname,
      '../../tmp',
      `${uuidv4()}.%(ext)s`
    );
    const format = UrlUtils.buildYtDlpFormat(quality);
    const command = [
      'yt-dlp',
      `-f "${format}"`,
      '--merge-output-format mp4',
      `--print after_move:filepath`,
      `-o "${outputTemplate}"`,
      `"${url}"`,
    ].join(' ');

    const output = await ShellUtils.exec(command);
    const filePath = output.trim().split('\n').pop() || '';
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`yt-dlp did not produce a file at: ${filePath}`);
    }
    return filePath;
  }

  static async download(url: string, quality?: string): Promise<string> {
    // Try a HEAD request first to check if this is a direct file URL
    try {
      const headResponse = await axios.request({
        method: 'HEAD',
        url,
        timeout: 10000,
      });
      const contentType: string =
        headResponse.headers['content-type'] || '';
      if (UrlUtils.isDirectFile(contentType)) {
        return UrlUtils.downloadDirectFile(url, contentType);
      }
    } catch {
      // HEAD failed or timed out — fall through to yt-dlp
    }

    // Not a direct file (e.g. YouTube, Instagram, etc.) — use yt-dlp
    try {
      return await UrlUtils.downloadWithYtDlp(url, quality);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Error downloading with yt-dlp: ${message}`);
    }
  }

  private static async downloadDirectFile(
    url: string,
    headContentType: string
  ): Promise<string> {
    let response: AxiosResponse;
    try {
      response = await axios.request({
        method: 'GET',
        url,
        responseType: 'stream',
      });
    } catch (err: unknown) {
      throw new Error('Error downloading from url');
    }

    const contentType =
      (response.data.headers['content-type'] as string) || headContentType;
    const fileExtension = contentType.split('/')[1].split(';')[0].trim();
    const filePath = path.resolve(
      __dirname,
      '../../tmp',
      `${uuidv4()}.${fileExtension}`
    );
    const writer = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error: Error;
      writer.on('error', (err: Error) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) resolve(filePath);
      });
    });
  }
}
