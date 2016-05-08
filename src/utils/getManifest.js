import isEqual from 'lodash.isequal';
import path from 'path';
import generateManifest from './generateManifest';
import getCurrentManifest from './getCurrentManifest';
import writeFile from './writeFile'

export default function getManifest(directory) {
  return new Promise(async function(resolve, reject) {
    const manifestPath = path.join(directory, 'manifest.json');
    const manifest = {
      'script.js': null
    };
    const currentManifest = {
      ...manifest,
      ...getCurrentManifest(manifestPath)
    };
    Object.assign(
      manifest,
      await generateManifest(Object.keys(manifest), { directory })
    );
    if (isEqual(currentManifest, manifest)) {
      return resolve(manifest);
    }
    const manifestJson = JSON.stringify(manifest);
    return writeFile(manifestPath, manifestJson).then(function() {
      return resolve(manifest);
    }).catch(reject);
  });
}
