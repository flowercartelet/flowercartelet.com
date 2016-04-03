import moment from 'moment/min/moment-with-locales';
import React from 'react';
import getRoot from '../utils/getRoot';

export default class ScreenshotComponent extends React.Component {
  static defaultProps = {
    enabled: false
  };
  static propTypes = {
    enabled: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func,
    screenshot: React.PropTypes.shape({
      createdAt: React.PropTypes.string,
      images: React.PropTypes.objectOf(React.PropTypes.shape({
        height: React.PropTypes.number,
        uri: React.PropTypes.string.isRequired,
        width: React.PropTypes.number
      }))
    })
  };

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
        <a href={images.original.uri} onClick={::this.handleClick}>
          <div
            className='image'
            style={{ backgroundImage: `url(${this.getImageUri()})` }}
          />
          <time dateTime={screenshot.createdAt}>
            <i className='fa fa-clock-o'/>
            {` ${moment(screenshot.createdAt).fromNow()}`}
          </time>
        </a>
      </div>
    );
  }
}
