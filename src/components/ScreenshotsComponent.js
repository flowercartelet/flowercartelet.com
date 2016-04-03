import isEqual from 'lodash.isequal';
import React from 'react';
import ScreenshotComponent from './ScreenshotComponent';
import getRoot from '../utils/getRoot';
import parseJson from '../utils/parseJson';

export default class ScreenshotsComponent extends React.Component {
  state = {
    currentUri: null,
    screenshots: []
  };

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

  handleClickScreenshot(event) {
    let target = event.target;
    let count = 0;
    while (target.tagName.toLowerCase() !== 'a' && count < 10) {
      target = target && target.parentNode;
      ++count;
    }
    const uri = target.href;
    if (typeof uri === 'undefined') {
      return true;
    }
    event.preventDefault();
    this.setState({
      currentUri: this.state.currentUri === uri ? null : uri
    });
    return false;
  }

  render() {
    return (
      <section>
        <h2>スクリーンショット</h2>
        <div className='screenshots'>
          {this.state.screenshots.map((screenshot) => (
            <ScreenshotComponent
              enabled={this.state.currentUri === screenshot.images.original.uri}
              key={screenshot.images.original.uri}
              onClick={::this.handleClickScreenshot}
              screenshot={screenshot}
            />
          ))}
        </div>
      </section>
    );
  }
}
