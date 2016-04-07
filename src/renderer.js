import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom/server';
import RootComponent from './components/RootComponent';

const html = ReactDOM.renderToStaticMarkup(<RootComponent/>);
console.log(`<!DOCTYPE html>\n${html}`);
