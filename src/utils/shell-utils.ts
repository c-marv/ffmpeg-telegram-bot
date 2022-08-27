import {exec} from 'child_process';

export class ShellUtils {
  static async exec(command: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      exec(command, (err, stdout, stderr) => {
        if (err) return rejects(stderr);
        return resolve(stdout);
      });
    });
  }
}
