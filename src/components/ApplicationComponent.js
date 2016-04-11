import moment from 'moment';
import React, { Component } from 'react';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import ScreenshotsComponent from './ScreenshotsComponent';
import getRoot from '../utils/getRoot';

export default class ApplicationComponent extends Component {
  static displayName = 'ApplicationComponent';

  componentDidMount() {
    const root = getRoot();
    const locale = root.lang || 'en';
    moment.locale(locale);
  }

  render() {
    return (
      <div className='ApplicationComponent'>
        <HeaderComponent/>
        <main>
          <ScreenshotsComponent/>
        </main>
        <FooterComponent/>
      </div>
    );
  }
}
