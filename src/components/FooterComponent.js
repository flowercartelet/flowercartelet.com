import isEqual from 'lodash.isequal';
import React, { Component } from 'react';
import { intlShape } from 'react-intl';

export default class FooterComponent extends Component {
  static contextTypes = {
    intl: intlShape
  };
  static displayName = 'FooterComponent';

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.props, nextProps) ||
      !isEqual(this.state, nextState)
    )
  }

  render() {
    const { locale } = this.context.intl;
    return (
      <footer>
        <div className='external'>
          <p>記載されている会社名・製品名・システム名などは、各社の商標、または登録商標です。</p>
          <p className='copyright' lang={locale === 'en-us' ? null : 'en-us'}>
            Copyright &copy; 2010-2016 SQUARE ENIX CO., LTD. All Rights Reserved.
          </p>
        </div>
        <p className='copyright' lang={locale === 'en-us' ? null : 'en-us'}>
          Copyright &copy; 2016
          {' '}
          <a href='mailto:flowercartelet@gmail.com' rel='author'>
            Lily Cartelet
          </a>
        </p>
      </footer>
    );
  }
}
