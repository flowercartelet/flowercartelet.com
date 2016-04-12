import isEqual from 'lodash.isequal';
import React, { Component } from 'react';

export default class NoMatchComponent extends Component {
  static displayName = 'NoMatchComponent';

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
