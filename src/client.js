import './polyfill';
import 'intl';
import 'intl/locale-data/jsonp/ja';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory as history, match, Router } from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import routes from './routes';
import RootComponent from './components/RootComponent';
import getRoot from './utils/getRoot';

const root = getRoot();
const locale = root.lang || en;

match({ history, routes }, function(error, redirectLocation, renderProps) {
  if (error instanceof Error) {
    throw error;
  }
  const initialState = window.__INITIAL_STATE__;
  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
  const store = createStoreWithMiddleware(reducers, initialState);
  ReactDOM.render(
    <RootComponent locale={locale} store={store}>
      <Router {...renderProps}/>
    </RootComponent>,
    document.getElementById('app')
  );
});
