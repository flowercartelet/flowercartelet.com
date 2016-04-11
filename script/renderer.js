import '../src/polyfill';
import crypto from 'crypto';
import fs from 'fs';
import isEqual from 'lodash.isequal';
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

function getCurrentManifest(manifestPath) {
  return new Promise(function(resolve) {
    fs.readFile(manifestPath, function(error, manifestJson) {
      const manifest = {};
      if (!(error instanceof Error)) {
        try {
          Object.assign(manifest, JSON.parse(manifestJson));
        } catch (error) {
        }
      }
      resolve(manifest);
    });
  });
}

function generateManifest(files, { assetDirectory }) {
  return new Promise(function(resolve) {
    const manifest = {};
    return Promise.all(files.map(function(fileName) {
      return new Promise(async function(done) {
        const filePath = path.join(assetDirectory, fileName);
        const hash = await getHash(filePath);
        const assetUri = `/asset/${fileName}?${hash}`;
        manifest[fileName] = assetUri;
        done(assetUri);
      });
    })).then(function() {
      return manifest;
    }).then(resolve);
  });
}

function getManifest(directory) {
  return new Promise(async function(resolve, reject) {
    const assetDirectory = path.join(directory, 'asset');
    const manifestPath = path.join(assetDirectory, 'manifest.json');
    const manifest = {
      'script.js': null,
      'style.css': null
    };
    const currentManifest = {
      ...manifest,
      ...getCurrentManifest(manifestPath)
    };
    Object.assign(
      manifest,
      await generateManifest(Object.keys(manifest), { assetDirectory })
    );
    if (isEqual(currentManifest, manifest)) {
      return resolve(manifest);
    }
    const manifestJson = JSON.stringify(manifest);
    fs.writeFile(manifestPath, manifestJson, function(error) {
      if (error instanceof Error) {
        return reject(error);
      }
      return resolve(manifest);
    });
  });
}

function writeHtml(filePath, { manifest, markup }) {
  return new Promise(function(resolve, reject) {
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
}

async function writeIndex(directory, props) {
  const filePath = path.join(directory, 'index.html');
  props.markup = ReactDOM.renderToString(<ApplicationComponent/>);
  await writeHtml(filePath, props);
}

async function main() {
  const directory = path.join(__dirname, '..');
  const manifest = await getManifest(directory);
  await Promise.all([
    writeIndex(directory, { manifest })
  ]);
}

main();