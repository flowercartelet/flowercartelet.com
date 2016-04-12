import React, { Component } from 'react';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import ScreenshotsComponent from './ScreenshotsComponent';

export default class ApplicationComponent extends Component {
  static displayName = 'ApplicationComponent';

  render() {
    return (
      <div className='ApplicationComponent'>
        <HeaderComponent/>
        <main>
          {this.props.children}
        </main>
        <FooterComponent/>
      </div>
    );
  }
}
