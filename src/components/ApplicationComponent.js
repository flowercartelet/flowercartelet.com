import moment from 'moment/min/moment-with-locales';
import React from 'react';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import ScreenshotsComponent from './ScreenshotsComponent';
import getRoot from '../utils/getRoot';

export default class ApplicationComponent extends React.Component {
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
