import classNames from 'classnames';
import throttle from 'lodash.throttle';
import React, { Component, PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { connect } from 'react-redux';
import setCurrentScreenshotAction from '../actions/setCurrentScreenshotAction';
import screenshotShape from '../types/screenshotShape';
import getEmptyPng from '../utils/getEmptyPng';

export default connect()(class ScreenshotComponent extends Component {
  static defaultProps = {
    emptyPng: getEmptyPng()
  };
  static displayName = 'ScreenshotComponent';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    emptyPng: PropTypes.string.isRequired,
    screenshot: screenshotShape
  };

  state = {
    canLoadImage: false,
    loaded: false
  }

  constructor(...args) {
    super(...args);
    this.handleClickImage = ::this.handleClickImage;
    this.handleLoadImage = ::this.handleLoadImage;
    this.handleScroll = throttle(::this.handleScroll);
  }

  componentDidMount() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);
  }

  componentWillUnmount() {
    if (!this.state.canLoadImage) {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleScroll);
    }
  }

  handleClickImage(event) {
    event.preventDefault();
    const { screenshot } = this.props;
    this.props.dispatch(setCurrentScreenshotAction(screenshot));
    return false;
  }

  handleLoadImage() {
    if (this.state.canLoadImage && !this.state.loaded) {
      this.setState({
        loaded: true
      });
    }
  }

  handleScroll() {
    const { image, imageWrapper } = this.refs;
    const { offsetHeight } = imageWrapper;
    const { top: offsetTop } = imageWrapper.getBoundingClientRect();
    if (
      offsetTop - window.innerHeight <= 200 &&
      offsetTop + offsetHeight >= -200
    ) {
      this.setState({ canLoadImage: true }, () => {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleScroll);
        image.complete && this.handleLoadImage();
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.canLoadImage !== nextState.canLoadImage ||
      this.state.loaded !== nextState.loaded
    );
  }

  render() {
    const { screenshot } = this.props;
    const {
      mosaic: mosaicImage,
      thumbnail: image
    } = screenshot.images;
    return (
      <div className='screenshot'>
        <div
          className='image'
          onClick={this.handleClickImage}
          ref='imageWrapper'
        >
          <img
            alt=''
            className={classNames({ visible: this.state.loaded })}
            height={image.height}
            onLoad={this.handleLoadImage}
            ref='image'
            src={this.state.canLoadImage ? image.uri : this.props.emptyPng}
            width={image.width}
          />
          <img
            alt=''
            className={classNames('mosaic', { visible: !this.state.loaded })}
            height={image.height}
            src={mosaicImage.uri}
            width={image.width}
          />
        </div>
        <time dateTime={screenshot.createdAt}>
          <i className='fa fa-clock-o'/>
          {' '}
          <FormattedRelative value={screenshot.createdAt}/>
        </time>
      </div>
    );
  }
});
