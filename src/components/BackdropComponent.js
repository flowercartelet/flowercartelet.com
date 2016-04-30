import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import getRoot from '../utils/getRoot';

@connect(function({ screenshotsReducer }) {
  const { currentScreenshot } = screenshotsReducer;
  const visible = !!currentScreenshot;
  return { visible };
})
export default class BackdropComponent extends Component {
  static displayName = 'BackdropComponent';
  static propTypes = {
    visible: PropTypes.bool.isRequired
  };

  constructor(...args) {
    super(...args);
    this.handleClick = ::this.handleClick;
    this.root = null;
  }

  componentWillReceiveProps(nextProps) {
    this.root = this.root || getRoot();
    if (!this.props.visible && nextProps.visible) {
      this.root.classList.add('overlay-enabled');
    } else if (this.props.visible && !nextProps.visible) {
      this.root.classList.remove('overlay-enabled');
    }
  }

  handleClick(event) {
    event.preventDefault();
    return false;
  }

  shouldComponentUpdate(nextProps) {
    return this.props.visible !== nextProps.visible;
  }

  render() {
    const { visible } = this.props;
    return (
      <div className={classNames('backdrop', { visible })}/>
    );
  }
}
