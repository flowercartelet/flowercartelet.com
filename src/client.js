import './polyfill';
import 'moment/locale/ja';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory as history, match, Router } from 'react-router';
import routes from './routes';

match({ history, routes }, function(error, redirectLocation, renderProps) {
  if (error instanceof Error) {
    throw error;
  }
  ReactDOM.render(
    <Router {...renderProps}/>,
    document.getElementById('app')
  );
});
