import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class NoMatchComponent extends Component {
  static displayName = 'NoMatchComponent';

  shouldComponentUpdate(...args) {
    return shallowCompare(this, ...args);
  }

  render() {
    return (
      <section id='error'>
        <h2>
          <span className='status-code'>404</span>
          &nbsp;
          <span className='reason-phrase'>Not Found</span>
        </h2>
        <p className='message'>あなたがおさがしのページは見つかりませんでした。</p>
      </section>
    );
  }
}
