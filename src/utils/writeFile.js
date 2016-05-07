import fs from 'fs';

export default function writeFile(filePath, body) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filePath, body, function(error) {
      if (error instanceof Error) {
        return reject(error);
      }
      return resolve(body);
    });
  });
}
