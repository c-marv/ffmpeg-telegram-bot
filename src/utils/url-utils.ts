import axios, {AxiosResponse} from 'axios';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';

export class UrlUtils {
  static isValid(url: string): boolean {
    if (!url) return false;
    const matchResult = url.match(
      // eslint-disable-next-line no-useless-escape
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    );
    return matchResult !== null && matchResult.length > 0;
  }

  static async download(url: string): Promise<string> {
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

    const contentType = response.data.headers['content-type'];
    const fileExtension = contentType.split('/')[1];
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
