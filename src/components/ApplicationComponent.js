import isEqual from 'lodash.isequal';
import React, { Component, PropTypes } from 'react';
import BackdropComponent from './BackdropComponent';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import ScreenshotsComponent from './ScreenshotsComponent';

export default class ApplicationComponent extends Component {
  static displayName = 'ApplicationComponent';

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.props, nextProps),
      !isEqual(this.state, nextState)
    );
  }

  render() {
    return (
      <div className='ApplicationComponent'>
        <HeaderComponent/>
        <main>
          {this.props.children}
        </main>
        <FooterComponent/>
        <BackdropComponent/>
      </div>
    );
  }
}
