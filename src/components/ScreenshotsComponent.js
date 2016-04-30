import isEqual from 'lodash.isequal';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PickupScreenshotComponent from './PickupScreenshotComponent';
import ScreenshotComponent from './ScreenshotComponent';
import fetchScreenshotsAction from '../actions/fetchScreenshotsAction';
import screenshotShape from '../types/screenshotShape';
import getRoot from '../utils/getRoot';

@connect(function({ screenshotsReducer }) {
  const { currentScreenshot, screenshots } = screenshotsReducer;
  return { currentScreenshot, screenshots };
})
export default class ScreenshotsComponent extends Component {
  static defaultProps = {
    currentScreenshot: null,
    screenshots: []
  };
  static displayName = 'ScreenshotsComponent';
  static propTypes = {
    currentScreenshot: screenshotShape,
    screenshots: PropTypes.arrayOf(screenshotShape)
  };

  constructor(...args) {
    super(...args);
    this.root = null;
  }

  componentDidMount() {
    this.root = this.root || getRoot();
    const screenshotListUri = this.root.dataset.screenshotListUri;
    this.props.dispatch(fetchScreenshotsAction(screenshotListUri));
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props.currentScreenshot, nextProps.currentScreenshot) ||
      !isEqual(this.props.screenshots, nextProps.screenshots)
    );
  }

  render() {
    return (
      <section id='recently-screenshots'>
        <h2>スクリーンショット</h2>
        <div className='screenshots'>
          {this.props.screenshots.map(function(screenshot) {
            const { original: image } = screenshot.images;
            return (
              <ScreenshotComponent
                key={image.uri}
                screenshot={screenshot}
              />
            );
          })}
        </div>
        <PickupScreenshotComponent/>
      </section>
    );
  }
}
