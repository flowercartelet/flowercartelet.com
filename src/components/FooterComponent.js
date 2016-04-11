import isEqual from 'lodash.isequal';
import React, { Component } from 'react';

export default class FooterComponent extends Component {
  static displayName = 'FooterComponent';

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  render() {
    return (
      <footer>
        <p className='copyright'>
          Copyright &copy; 2016&nbsp;
          <a href='mailto:flowercartelet@gmail.com' rel='author'>
            Lily Cartelet
          </a>
        </p>
      </footer>
    );
  }
}
