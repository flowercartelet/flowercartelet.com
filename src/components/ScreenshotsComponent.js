import classNames from 'classnames';
import isEqual from 'lodash.isequal';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LoadingComponent from './LoadingComponent';
import PickupScreenshotComponent from './PickupScreenshotComponent';
import ScreenshotComponent from './ScreenshotComponent';
import fetchScreenshotsAction from '../actions/fetchScreenshotsAction';
import screenshotShape from '../types/screenshotShape';

@connect(function({ screenshotsReducer }) {
  const {
    currentScreenshot,
    screenshotListUri,
    screenshots
  } = screenshotsReducer;
  return { currentScreenshot, screenshotListUri, screenshots };
})
export default class ScreenshotsComponent extends Component {
  static defaultProps = {
    currentScreenshot: null,
    screenshots: []
  };
  static displayName = 'ScreenshotsComponent';
  static propTypes = {
    currentScreenshot: screenshotShape,
    screenshotListUri: PropTypes.string.isRequired,
    screenshots: PropTypes.arrayOf(screenshotShape)
  };

  constructor(...args) {
    super(...args);
    this.root = null;
  }

  componentDidMount() {
    const { screenshots } = this.props;
    if (screenshots.length < 1) {
      const { screenshotListUri } = this.props;
      this.props.dispatch(fetchScreenshotsAction(screenshotListUri));
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props.currentScreenshot, nextProps.currentScreenshot) ||
      !isEqual(this.props.screenshots, nextProps.screenshots)
    );
  }

  render() {
    const { screenshots } = this.props;
    return (
      <section id='recently-screenshots'>
        <h2>スクリーンショット</h2>
        <LoadingComponent visible={screenshots.length < 1}/>
        <div className='screenshots'>
          {screenshots.map(function(screenshot) {
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
