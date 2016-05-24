import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class LoadingComponent extends Component {
  static defaultProps = {
    visible: true
  };
  static propTypes = {
    visible: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return this.props.visible !== nextProps.visible;
  }

  render() {
    return (
      <div className={classNames('loading', {
        visible: this.props.visible
      })}/>
    );
  }
}
