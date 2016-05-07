import '../src/polyfill';
import CleanCSS from 'clean-css';
import crypto from 'crypto';
import isEqual from 'lodash.isequal';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import fetchScreenshotsAction from '../src/actions/fetchScreenshotsAction';
import setScreenshotListUriAction from '../src/actions/setScreenshotListUriAction';
import HtmlComponent from '../src/components/HtmlComponent';
import RootComponent from '../src/components/RootComponent';
import ScreenshotsComponent from '../src/components/ScreenshotsComponent';
import reducers from '../src/reducers';
import routes from '../src/routes';
import readFile from '../src/utils/readFile';
import writeFile from '../src/utils/writeFile';

const locale = 'ja-jp';
const screenshotListUri = 'https://screenshot.flowercartelet.com/index.json';

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
    return writeFile(manifestPath, manifestJson).then(function() {
      return resolve(manifest);
    }).catch(reject);
  });
}

function writeHtml(location, filePath, { manifest, store, styleSheet }) {
  return new Promise(function(resolve, reject) {
    match({ location, routes }, function(error, redirectLocation, renderProps) {
      if (error instanceof Error) {
        return reject(error);
      }
      const styles = [];
      const markup = ReactDOM.renderToString(
        <RootComponent locale={locale} store={store}>
          <RouterContext {...renderProps}/>
        </RootComponent>
      );
      const initialState = store.getState();
      const html = ReactDOM.renderToStaticMarkup(
        <HtmlComponent
          initialState={initialState}
          locale={locale}
          manifest={manifest}
          markup={markup}
          styleSheet={styleSheet}
        />
      );
      const body = `<!DOCTYPE html>\n${html}`;
      return writeFile(filePath, body).then(resolve).catch(reject);
    });
  });
}

async function main() {
  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
  const store = createStoreWithMiddleware(reducers);
  const rootDirectory = path.join(__dirname, '..');
  const assetDirectory = path.join(rootDirectory, 'asset')
  const componentsDirectory = path.join(rootDirectory, 'src', 'components');
  const styleSheetPath = path.join(componentsDirectory, 'RootComponent.css');
  try {
    const manifest = await getManifest(assetDirectory);
    const styleSheetSource = await readFile(styleSheetPath);
    const styleSheet = (new CleanCSS({
      processImport: true,
      processImportFrm: ['local'],
      relativeTo: componentsDirectory
    })).minify(styleSheetSource).styles;
    const props = { manifest, store, styleSheet }
    await store.dispatch(setScreenshotListUriAction(screenshotListUri));
    await Promise.all([
      writeHtml('/', path.join(rootDirectory, 'index.html'), props),
      writeHtml('/404.html', path.join(rootDirectory, '404.html'), props)
    ]);
  } catch (error) {
    console.error(error);
  }
}

main();
