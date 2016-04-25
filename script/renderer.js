import '../src/polyfill';
import CleanCSS from 'clean-css';
import crypto from 'crypto';
import fs from 'fs';
import isEqual from 'lodash.isequal';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../src/routes';
import HtmlComponent from '../src/components/HtmlComponent';
import RootComponent from '../src/components/RootComponent';

const locale = 'ja-jp';

function readFile(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, function(error, body) {
      return error instanceof Error ?
        reject(error) : resolve(body.toString());
    });
  });
}

function getHash(filePath) {
  return new Promise(async function(resolve, reject) {
    try {
      const body = await readFile(filePath);
      const hash = crypto.createHash('sha512');
      hash.update(body);
      return resolve(hash.digest('hex'));
    } catch (error) {
      return reject(error);
    }
  });
}

function getCurrentManifest(manifestPath) {
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

function generateManifest(files, { directory }) {
  return new Promise(function(resolve) {
    const manifest = {};
    return Promise.all(files.map(function(fileName) {
      return new Promise(async function(done) {
        const filePath = path.join(directory, fileName);
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
    fs.writeFile(manifestPath, manifestJson, function(error) {
      if (error instanceof Error) {
        return reject(error);
      }
      return resolve(manifest);
    });
  });
}

function writeHtml(location, filePath, { manifest, styleSheet }) {
  return new Promise(function(resolve, reject) {
    match({ location, routes }, function(error, redirectLocation, renderProps) {
      if (error instanceof Error) {
        return reject(error);
      }
      const markup = ReactDOM.renderToString(
        <RootComponent locale={locale}>
          <RouterContext {...renderProps}/>
        </RootComponent>
      );
      const html = ReactDOM.renderToStaticMarkup(
        <HtmlComponent
          locale={locale}
          manifest={manifest}
          markup={markup}
          styleSheet={styleSheet}
        />
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

async function main() {
  try {
    const directory = path.join(__dirname, '..');
    const assetDirectory = path.join(directory, 'asset');
    const styleSheetPath = path.join(assetDirectory, 'style.css');
    const manifest = await getManifest(assetDirectory);
    const styleSheetSource = await readFile(styleSheetPath);
    const styleSheet = new CleanCSS().minify(styleSheetSource).styles;
    const props = { manifest, styleSheet };
    await Promise.all([
      writeHtml('/', path.join(directory, 'index.html'), props),
      writeHtml('/404.html', path.join(directory, '404.html'), props)
    ]);
  } catch (error) {
    console.error(error);
  }
}

main();
