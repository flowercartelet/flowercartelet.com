import classNames from 'classnames';
import shallowEqual from 'fbjs/lib/shallowEqual';
import React, { Component, PropTypes } from 'react';
import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleRight from 'react-icons/lib/fa/angle-right';
import { connect } from 'react-redux';
import setCurrentScreenshotAction from '../actions/setCurrentScreenshotAction';
import screenshotShape from '../types/screenshotShape';
import compareScreenshots from '../utils/compareScreenshots';

@connect(function({ screenshotsReducer }) {
  const { currentScreenshot, screenshots } = screenshotsReducer;
  return { currentScreenshot, screenshots };
})
export default class PickupScreenshotComponent extends Component {
  static defaultProps = {
    currentScreenshot: null,
    screenshots: []
  };
  static displayName = 'PickupScreenshotComponent';
  static propTypes = {
    currentScreenshot: screenshotShape,
    dispatch: PropTypes.func.isRequired,
    screenshots: PropTypes.arrayOf(screenshotShape)
  };

  constructor(...args) {
    super(...args);
    this.handleClickImage = ::this.handleClickImage;
    this.handleClickNextButton = ::this.handleClickNextButton;
    this.handleClickPreviousButton = ::this.handleClickPreviousButton;
    this.handleKeyDown = ::this.handleKeyDown;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  getSiblingScreenshot(count = 1) {
    const { currentScreenshot } = this.props;
    if (currentScreenshot) {
      const { uri: currentScreenshotUri } = currentScreenshot.images.original;
      const screenshots = this.props.screenshots;
      const screenshotUris = screenshots.map(function(screenshot) {
        return screenshot.images.original.uri;
      });
      const index = screenshotUris.indexOf(currentScreenshotUri);
      const siblingScreenshot = index >= 0 && screenshots[index + count];
      return (
        typeof siblingScreenshot === 'undefined' ||
        compareScreenshots(this.props.currentScreenshot, siblingScreenshot)
      ) ? null : siblingScreenshot;
    }
    return null;
  }

  handleClickImage(event) {
    this.props.dispatch(setCurrentScreenshotAction(null));
  }

  handleClickNextButton(event) {
    event.preventDefault();
    const screenshot = this.getSiblingScreenshot(1);
    this.props.dispatch(setCurrentScreenshotAction(screenshot));
    return false;
  }

  handleClickPreviousButton(event) {
    event.preventDefault();
    const screenshot = this.getSiblingScreenshot(-1);
    this.props.dispatch(setCurrentScreenshotAction(screenshot));
    return false;
  }

  handleKeyDown(event) {
    const { keyCode } = event;
    if (
      this.props.currentUri !== null &&
      [27, 37, 39].includes(keyCode)
    ) {
      event.preventDefault();
      const screenshot = keyCode === 27 ?
        null : this.getSiblingScreenshot(keyCode === 39 ? 1 : -1);
      this.props.dispatch(setCurrentScreenshotAction(screenshot));
      return false;
    }
    return true;
  }

  shouldComponentUpdate(nextProps) {
    const { currentScreenshot, screenshots } = this.props;
    const {
      currentScreenshot: nextScreenshot,
      screenshots: nextScreenshots
    } = nextProps
    return (
      !compareScreenshots(currentScreenshot, nextScreenshot) ||
      !shallowEqual(screenshots, nextScreenshots)
    );
  }

  render() {
    return (
      <div className={classNames('pickup-screenshot', {
        visible: !!this.props.currentScreenshot
      })}>
        <div className='image' onClick={this.handleClickImage}>
          {this.props.currentScreenshot && (function(image) {
            return (
              <img
                alt=''
                height={image.height}
                src={image.uri}
                width={image.width}
              />
            );
          })(this.props.currentScreenshot.images.original)}
        </div>
        <nav>
          <ul>
            <li className='prev'>
              <button
                onClick={this.handleClickPreviousButton}
              >
                <FaAngleLeft size='150px'/>
              </button>
            </li>
            <li className='next'>
              <button
                onClick={this.handleClickNextButton}
              >
                <FaAngleRight size='150px'/>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
