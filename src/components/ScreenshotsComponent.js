import isEqual from 'lodash.isequal';
import React, { Component } from 'react';
import ScreenshotComponent from './ScreenshotComponent';
import getRoot from '../utils/getRoot';
import parseJson from '../utils/parseJson';

export default class ScreenshotsComponent extends Component {
  static displayName = 'ScreenshotsComponent';

  state = {
    currentUri: null,
    screenshots: []
  };

  constructor(...args) {
    super(...args);
    this.handleClickShowNextScreenshot = ::this.handleClickShowNextScreenshot;
    this.handleClickShowPreviousScreenshot =
      ::this.handleClickShowPreviousScreenshot;
    this.handleClickShowScreenshot = ::this.handleClickShowScreenshot;

  }

  componentDidMount() {
    const root = getRoot();
    const screenshotListUri = root.dataset.screenshotListUri;
    fetch(screenshotListUri).then(parseJson).then((response) => {
      this.setState({
        currentUri: null,
        screenshots: response
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.currentUri !== nextState.currentUri ||
      !isEqual(this.state.screenshots, nextState.screenshots)
    );
  }

  handleClickShowNextScreenshot(event) {
    event.preventDefault();
    this.setState({
      currentUri: this.getSiblingScreenshotUri(1)
    });
    return false;
  }

  handleClickShowPreviousScreenshot(event) {
    event.preventDefault();
    this.setState({
      currentUri: this.getSiblingScreenshotUri(-1)
    });
    return false;
  }

  handleClickShowScreenshot(event) {
    const anchor = event.currentTarget;
    const uri = anchor.href;
    if (typeof uri === 'undefined') {
      return true;
    }
    event.preventDefault();
    this.setState({
      currentUri: this.state.currentUri === uri ? null : uri
    });
    return false;
  }

  getSiblingScreenshotUri(count = 1) {
    const uri = this.state.currentUri;
    if (typeof uri === 'undefined') {
      return null;
    }
    const screenshots = this.state.screenshots;
    const screenshotUris = screenshots.map((screenshot) =>
      screenshot.images.original.uri);
    const index = screenshotUris.indexOf(uri);
    if (index < 0) {
      return null;
    }
    const siblingScreenshotUri = screenshotUris[index + count];
    if (
      typeof siblingScreenshotUri === 'undefined' ||
      this.state.currentUri === siblingScreenshotUri
    ) {
      return null;
    }
    return siblingScreenshotUri;
  }

  render() {
    return (
      <section id='recently-screenshots'>
        <h2>スクリーンショット</h2>
        <div className='screenshots'>
          {this.state.screenshots.map((screenshot) => (
            <ScreenshotComponent
              enabled={this.state.currentUri === screenshot.images.original.uri}
              key={screenshot.images.original.uri}
              onClick={this.handleClickShowScreenshot}
              screenshot={screenshot}
            />
          ))}
        </div>
        <nav className={this.state.currentUri ? 'visible' : ''}>
          <ul>
            <li className='prev'>
              <button
                onClick={this.handleClickShowPreviousScreenshot}
              >
                prev
              </button>
            </li>
            <li className='next'>
              <button
                onClick={this.handleClickShowNextScreenshot}
              >
                next
              </button>
            </li>
          </ul>
        </nav>
      </section>
    );
  }
}
