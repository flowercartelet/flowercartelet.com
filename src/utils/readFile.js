import fs from 'fs';

export default function readFile(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, function(error, body) {
      return error instanceof Error ?
        reject(error) : resolve(body.toString());
    });
  });
}
