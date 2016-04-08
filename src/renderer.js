import './polyfill';
import React from 'react';
import ReactDOM from 'react-dom/server';
import ApplicationComponent from './components/ApplicationComponent';
import RootComponent from './components/RootComponent';

const markup = ReactDOM.renderToString(<ApplicationComponent/>);
const html = ReactDOM.renderToStaticMarkup(<RootComponent markup={markup}/>);
console.log(`<!DOCTYPE html>\n${html}`);
