import readFile from './readFile';

export default function getCurrentManifest(manifestPath) {
  return new Promise(async function(resolve) {
    const manifest = {};
    try {
      const manifestJson = await readFile(manifestPath);
      Object.assign(manifest, JSON.parse(manifestJson));
    } catch (error) {
    }
    resolve(manifest);
  });
}
