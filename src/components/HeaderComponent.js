import isEqual from 'lodash.isequal';
import React, { Component } from 'react';
import FaExternalLink from 'react-icons/lib/fa/external-link';
import FaTwitter from 'react-icons/lib/fa/twitter';
import { IndexLink } from 'react-router';

export default class HeaderComponent extends Component {
  static displayName = 'HeaderComponent';

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  getTwitterUri() {
    return 'https://twitter.com/flowercartelet';
  }

  getLodestoneUri() {
    return 'http://jp.finalfantasyxiv.com/lodestone/character/3244798/';
  }

  render() {
    return (
      <header>
        <h1>
          <IndexLink to='/'>かーたんのほーむぺーじ</IndexLink>
        </h1>
        <p className='description'>
          FINAL FANTASY XIV (Fenrirサーバー) で学者を主に使っている
          <ruby>
            <em>Lily</em>
            <rp>(</rp>
            <rt>りりぃ</rt>
            <rp>)</rp>
          </ruby>
          {' '}
          <ruby>
            <em>Cartelet</em>
            <rp>(</rp>
            <rt>かーたれっと</rt>
            <rp>)</rp>
          </ruby>
          のウェブサイトです。FINAL FANTASY XIVの個人的なスクリーンショットを置くための場所です。
        </p>
        <nav>
          <ul>
            <li>
              <a
                className='share twitter'
                href={this.getTwitterUri()}
              >
                <FaTwitter style={{ verticalAlign: 'text-top' }}/>
                {' '}
                Twitter
              </a>
            </li>
            <li>
              <a
                className='share lodestone'
                href={this.getLodestoneUri()}
              >
                Lodestone
                {' '}
                <FaExternalLink style={{ verticalAlign: 'text-top' }}/>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
