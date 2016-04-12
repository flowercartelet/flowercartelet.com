import React, { Component, PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import getRoot from '../utils/getRoot';

export default class ScreenshotComponent extends Component {
  static defaultProps = {
    enabled: false
  };
  static displayName = 'ScreenshotComponent';
  static propTypes = {
    enabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    screenshot: PropTypes.shape({
      createdAt: PropTypes.string,
      images: PropTypes.objectOf(React.PropTypes.shape({
        height: PropTypes.number,
        uri: PropTypes.string.isRequired,
        width: PropTypes.number
      }))
    })
  };

  constructor(...args) {
    super(...args);
    this.handleClick = ::this.handleClick;
  }

  componentWillReceiveProps(nextProps) {
    var root = getRoot();
    if (!this.props.enabled && nextProps.enabled) {
      root.classList.add('overlay-enabled');
    } else if (this.props.enabled && !nextProps.enabled) {
      root.classList.remove('overlay-enabled');
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.enabled !== nextProps.enabled;
  }

  handleClick(event) {
    return (
      typeof this.props.onClick === 'function' &&
      this.props.onClick(event)
    );
  }

  getImageUri() {
    var images = this.props.screenshot.images;
    var size = this.props.enabled ? 'original' : 'thumbnail';
    return images[size].uri;
  }

  render() {
    const screenshot = this.props.screenshot;
    const images = screenshot.images;
    return (
      <div className={`${this.props.enabled ? 'enabled ' : ''}screenshot`}>
        <a href={images.original.uri} onClick={this.handleClick}>
          <div
            className='image'
            style={{ backgroundImage: `url(${this.getImageUri()})` }}
          />
          <time dateTime={screenshot.createdAt}>
            <i className='fa fa-clock-o'/>
            &nbsp;
            <FormattedRelative value={screenshot.createdAt}/>
          </time>
        </a>
      </div>
    );
  }
}
