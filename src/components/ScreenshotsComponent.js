import classNames from 'classnames';
import shallowEqual from 'fbjs/lib/shallowEqual';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LoadingComponent from './LoadingComponent';
import PickupScreenshotComponent from './PickupScreenshotComponent';
import ScreenshotComponent from './ScreenshotComponent';
import fetchScreenshotsAction from '../actions/fetchScreenshotsAction';
import screenshotShape from '../types/screenshotShape';
import compareScreenshots from '../utils/compareScreenshots';
import isBrowser from '../utils/isBrowser';

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

  state = {
    count: 9
  };

  componentDidMount() {
    const { screenshots } = this.props;
    if (screenshots.length < 1) {
      const { screenshotListUri } = this.props;
      this.props.dispatch(fetchScreenshotsAction(screenshotListUri));
    } else {
      this.setState({ count: screenshots.length });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { screenshots } = nextProps;
    this.setState({ count: screenshots.length });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { currentScreenshot, screenshots } = this.props;
    const {
      currentScreenshot: nextScreenshot,
      screenshots: nextScreenshots
    } = nextProps
    return (
      this.state.count !== nextState.count ||
      !compareScreenshots(currentScreenshot, nextScreenshot) ||
      !shallowEqual(screenshots, nextScreenshots)
    );
  }

  render() {
    const { screenshots } = this.props;
    return (
      <section id='recently-screenshots'>
        <h2>スクリーンショット</h2>
        <LoadingComponent visible={screenshots.length < 1}/>
        <div className='screenshots'>
          {screenshots.slice(0, this.state.count).map(function(screenshot) {
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
