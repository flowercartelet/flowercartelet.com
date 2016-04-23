import './polyfill';
import 'intl';
import 'intl/locale-data/jsonp/ja';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory as history, match, Router } from 'react-router';
import routes from './routes';
import RootComponent from './components/RootComponent';
import getRoot from './utils/getRoot';

const root = getRoot();
const locale = root.lang || en;

match({ history, routes }, function(error, redirectLocation, renderProps) {
  if (error instanceof Error) {
    throw error;
  }
  ReactDOM.render(
    <RootComponent locale={locale}>
      <Router {...renderProps}/>
    </RootComponent>,
    document.getElementById('app')
  );
});
