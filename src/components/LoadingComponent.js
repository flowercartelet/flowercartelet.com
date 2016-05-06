import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class LoadingComponent extends Component {
  static defaultProps = {
    visible: true
  };
  static propTypes = {
    visible: PropTypes.bool.isRequired
  };

  render() {
    return (
      <div className={classNames('loading', {
        visible: this.props.visible
      })}/>
    );
  }
}
