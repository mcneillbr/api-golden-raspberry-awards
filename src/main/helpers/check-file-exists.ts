import fs from 'fs';

export function checkFileExists(fileName: string): Promise<boolean> {
  return new Promise((resolve, rejects) => {
    fs.access(fileName, fs.constants.F_OK, (err) => {
      if (err) {
        return rejects(false);
      }

      return resolve(true);
    });
  });
}
