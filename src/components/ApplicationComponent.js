import React, { Component, PropTypes } from 'react';
import ReactI13nGoogleAnalytics from 'react-i13n-ga';
import { locationShape } from 'react-router';
import BackdropComponent from './BackdropComponent';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import ScreenshotsComponent from './ScreenshotsComponent';
import setupI13n from '../decorators/setupI13n';

const reactI13nGoogleAnalytics = new ReactI13nGoogleAnalytics({
  trackingId: 'UA-75284039-1'
});

@setupI13n({}, [
  reactI13nGoogleAnalytics.getPlugin()
])
export default class ApplicationComponent extends Component {
  static displayName = 'ApplicationComponent';
  static propTypes = {
    i13n: PropTypes.object.isRequired,
    location: locationShape.isRequired
  };

  componentDidMount() {
    this.props.i13n.executeEvent('pageview', {});
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;
    if (location.pathname !== prevLocation.pathname) {
      this.props.i13n.executeEvent('pageview', {
        page: location.pathname
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { location } = this.props;
    const { location: nextLocation } = nextProps;
    return location.pathname !== nextLocation.pathname;
  }

  render() {
    return (
      <div className='ApplicationComponent'>
        <HeaderComponent/>
        <main>
          {this.props.children}
        </main>
        <FooterComponent/>
        <BackdropComponent/>
      </div>
    );
  }
}
