import './polyfill';
import 'intl';
import 'intl/locale-data/jsonp/ja';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactIntl, { IntlProvider } from 'react-intl';
import jaLocaleData from 'react-intl/locale-data/ja';
import { browserHistory as history, match, Router } from 'react-router';
import routes from './routes';
import getRoot from './utils/getRoot';

const root = getRoot();
const locale = root.lang || en;

ReactIntl.addLocaleData(jaLocaleData);

match({ history, routes }, function(error, redirectLocation, renderProps) {
  if (error instanceof Error) {
    throw error;
  }
  ReactDOM.render(
    <IntlProvider locale={locale}>
      <Router {...renderProps}/>
    </IntlProvider>,
    document.getElementById('app')
  );
});
