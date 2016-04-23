import React, { Component, PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { connect } from 'react-redux';
import setCurrentScreenshotAction from '../actions/setCurrentScreenshotAction';
import getRoot from '../utils/getRoot';

export default connect()(class ScreenshotComponent extends Component {
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

  handleClick(event) {
    event.preventDefault();
    const screenshot = this.props.enabled ?
      null : this.props.screenshot;
    this.props.dispatch(setCurrentScreenshotAction(screenshot));
    return false;
  }

  shouldComponentUpdate(nextProps) {
    return this.props.enabled !== nextProps.enabled;
  }

  render() {
    const { screenshot } = this.props;
    const { thumbnail: image } = screenshot.images;
    return (
      <div
        className={`${this.props.enabled ? 'enabled ' : ''}screenshot`}
        onClick={this.handleClick}
      >
        <img height={image.height} src={image.uri} width={image.width}/>
        <time dateTime={screenshot.createdAt}>
          <i className='fa fa-clock-o'/>
          {' '}
          <FormattedRelative value={screenshot.createdAt}/>
        </time>
      </div>
    );
  }
});
