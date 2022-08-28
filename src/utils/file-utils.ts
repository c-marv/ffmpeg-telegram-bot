import fs from 'fs';
import path from 'path';

export class FileUtils {
  static async delete(filePath: string): Promise<void> {
    return new Promise((resolve, rejects) => {
      fs.unlink(filePath, err => {
        if (err) return rejects(err);
        return resolve();
      });
    });
  }

  static ensureTmpFolder(): void {
    const tmpPath = path.resolve(__dirname, '../../tmp');
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath);
    }
  }
}
