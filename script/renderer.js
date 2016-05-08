import '../src/polyfill';
import CleanCSS from 'clean-css';
import path from 'path';
import setScreenshotListUriAction from '../src/actions/setScreenshotListUriAction';
import reducers from '../src/reducers';
import { renderComponent, renderHtml, screenshotListUri } from '../src/server';
import createStore from '../src/utils/createStore';
import getManifest from '../src/utils/getManifest';
import matchRoutes from '../src/utils/matchRoutes';
import readStyleSheet from '../src/utils/readStyleSheet';
import writeFile from '../src/utils/writeFile';

function writeHtml(location, filePath, props) {
  return new Promise(async function(resolve, reject) {
    let body = '';
    try {
      const { renderProps } = await matchRoutes({ location });
      const markup = renderComponent(props, renderProps);
      Object.assign(props, { markup });
      body += renderHtml(props);
    } catch (error) {
      return reject(error);
    }
    return writeFile(filePath, body).then(resolve).catch(reject);
  });
}

async function main() {
  const store = createStore(reducers);
  const rootDirectory = path.join(__dirname, '..');
  const assetDirectory = path.join(rootDirectory, 'asset')
  const componentsDirectory = path.join(rootDirectory, 'src', 'components');
  const styleSheetPath = path.join(componentsDirectory, 'RootComponent.css');
  try {
    const manifest = await getManifest(assetDirectory);
    const styleSheet = await readStyleSheet(styleSheetPath);
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
