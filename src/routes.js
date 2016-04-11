import React from 'react';
import { IndexRoute, Route } from 'react-router';
import ApplicationComponent from './components/ApplicationComponent';
import NoMatchComponent from './components/NoMatchComponent';
import ScreenshotsComponent from './components/ScreenshotsComponent';

export default (
  <Route component={ApplicationComponent} path='/'>
    <IndexRoute component={ScreenshotsComponent} name='home'/>
    <Route component={NoMatchComponent} path='*'/>
  </Route>
);
