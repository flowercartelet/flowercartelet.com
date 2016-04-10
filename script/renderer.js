import '../src/polyfill';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import ApplicationComponent from '../src/components/ApplicationComponent';
import RootComponent from '../src/components/RootComponent';

function getHash(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, function(error, body) {
      if (error instanceof Error) {
        return reject(error);
      }
      const hash = crypto.createHash('sha512');
      hash.update(body);
      return resolve(hash.digest('hex'));
    });
  });
}

function writeManifest(directory) {
  return new Promise(async function(resolve, reject) {
    const assetDirectory = path.join(directory, 'asset');
    const manifestPath = path.join(assetDirectory, 'manifest.json');
    const manifest = {};
    await Promise.all(['script.js', 'style.css'].map(function(fileName) {
      return new Promise(async function(done) {
        const filePath = path.join(assetDirectory, fileName);
        const hash = await getHash(filePath);
        manifest[fileName] = `/asset/${fileName}?${hash}`;
        done(manifest);
      });
    }));
    const body = JSON.stringify(manifest);
    fs.writeFile(manifestPath, body, function(error) {
      if (error instanceof Error) {
        return reject(error);
      }
      return resolve(manifest);
    });
  });
}

function writeHtml(filePath, markup) {
  return new Promise(function(resolve, reject) {
    const manifestPath = path.join(__dirname, '..', 'asset', 'manifest.json');
    fs.readFile(manifestPath, function(error, manifestJson) {
      if (error instanceof Error) {
        return reject(error);
      }
      const manifest = JSON.parse(manifestJson);
      const html = ReactDOM.renderToStaticMarkup(
        <RootComponent manifest={manifest} markup={markup}/>
      );
      const body = `<!DOCTYPE html>\n${html}`;
      fs.writeFile(filePath, body, function(error) {
        if (error instanceof Error) {
          return reject(error);
        }
        return resolve(body);
      });
    });
  });
}

async function writeIndex(directory) {
  const markup = ReactDOM.renderToString(<ApplicationComponent/>);
  const filePath = path.join(directory, 'index.html');
  await writeHtml(filePath, markup);
}

async function main() {
  const directory = path.join(__dirname, '..');
  await writeManifest(directory);
  await Promise.all([
    writeIndex(directory)
  ]);
}

main();
