import crypto from 'crypto';

export default function getHash(body) {
  return new Promise(async function(resolve, reject) {
    try {
      const hash = crypto.createHash('sha512');
      hash.update(body);
      return resolve(hash.digest('hex'));
    } catch (error) {
      return reject(error);
    }
  });
}
