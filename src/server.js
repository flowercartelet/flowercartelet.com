import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import { env } from 'process';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { RouterContext } from 'react-router';
import fetchScreenshotsAction from './actions/fetchScreenshotsAction';
import setScreenshotListUriAction from './actions/setScreenshotListUriAction';
import HtmlComponent from './components/HtmlComponent';
import RootComponent from './components/RootComponent';
import NoMatchComponent from './components/NoMatchComponent';
import ScreenshotsComponent from './components/ScreenshotsComponent';
import reducers from './reducers';
import createStore from './utils/createStore';
import getManifest from './utils/getManifest';
import matchRoutes from './utils/matchRoutes';
import readStyleSheet from './utils/readStyleSheet';

export const rootDirectory = path.join(__dirname, '..');

export const locale = 'ja-jp';
export const screenshotListUri = 'https://screenshot.flowercartelet.com/';

export function renderHtml({ manifest, markup, store, styleSheet }) {
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
  return `<!DOCTYPE html>\n${html}`;
}

export function renderComponent({ store }, renderProps) {
  const markup = ReactDOM.renderToString(
    <RootComponent locale={locale} store={store}>
      <RouterContext {...renderProps}/>
    </RootComponent>
  );
  return markup;
}

export const app = new Koa();

app.use(async function(ctx, next) {
  if (ctx.url.startsWith('/asset') || ctx.url.startsWith('/image')) {
    await serve(rootDirectory)(ctx, next);
  } else {
    await next();
  }
});

(function() {
  const assetDirectory = path.join(rootDirectory, 'asset');
  const componentsDirectory = path.join(rootDirectory, 'src', 'components');
  const styleSheetPath = path.join(componentsDirectory, 'RootComponent.css');
  let styleSheet;
  let manifest;
  app.use(async function(ctx, next) {
    styleSheet = styleSheet || await readStyleSheet(styleSheetPath);
    manifest = manifest || await getManifest(assetDirectory);
    ctx.props = {
      store: createStore(reducers),
      styleSheet,
      manifest,
      markup: null
    };
    await next();
    ctx.type = 'text/html; charset=utf-8';
    ctx.body = renderHtml(ctx.props);
  });
})();

app.use(async function(ctx, next) {
  try {
    const { renderProps } = await matchRoutes({
      location: ctx.url
    });
    if (typeof renderProps !== 'undefined') {
      const { store } = ctx.props;
      ctx.status = 200;
      if (renderProps.components.includes(NoMatchComponent)) {
        ctx.status = 404;
      }
      await store.dispatch(
        setScreenshotListUriAction(screenshotListUri)
      );
      if (renderProps.components.includes(ScreenshotsComponent)) {
        await store.dispatch(fetchScreenshotsAction(screenshotListUri));
      }
      const markup = renderComponent(ctx.props, renderProps);
      Object.assign(ctx.props, { markup });
    }
  } catch (error) {
    ctx.status = 500;
    Object.assign(ctx.props, {
      markup: `<p>${error.message}</p>`
    });
  } finally {
    await next();
  }
});
