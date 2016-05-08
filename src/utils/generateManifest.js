import path from 'path';
import getHash from './getHash';
import readFile from './readFile';

export default function generateManifest(files, { directory }) {
  return new Promise(function(resolve) {
    const manifest = {};
    return Promise.all(files.map(function(fileName) {
      return new Promise(async function(done) {
        const filePath = path.join(directory, fileName);
        const body = await readFile(filePath);
        const hash = await getHash(body);
        const assetUri = `/asset/${fileName}?${hash}`;
        manifest[fileName] = assetUri;
        done(assetUri);
      });
    })).then(function() {
      return manifest;
    }).then(resolve);
  });
}
