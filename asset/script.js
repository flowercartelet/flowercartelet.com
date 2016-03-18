(function() {
  'use script';

  var root;

  function request(uri, options) {
    options = options || {};
    var method = options['method'] || 'get';
    var body = options['body'] || null;
    return new Promise(function(resolve, reject) {
      var connect = new XMLHttpRequest();
      connect.open(method, uri);
      connect.responseType = 'json';
      connect.addEventListener('load', function() {
        if (connect.status === 200) {
          resolve(connect);
        } else {
          reject(connect);
        }
      });
      connect.addEventListener('error', function() {
        reject(connect);
      });
      connect.send(body);
    });
  }

  var ApplicationComponent = React.createClass({
    displayName: 'ApplicationComponent',
    render: function() {
      return React.createElement(ScreenshotsComponent, null);
    }
  });

  var ScreenshotsComponent = React.createClass({
    displayName: 'ScreenshotsComponent',
    getInitialState: function() {
      return {
        currentUri: null,
        screenshots: []
      };
    },
    componentDidMount: function() {
      request('/image/screenshots.json').then(function(connect) {
        var response = connect.response;
        this.setState({
          enabledUri: null,
          screenshots: response
        });
      }.bind(this));
    },
    handleClickScreenshot: function(event) {
      var target = event.target;
      var count = 0;
      while (target.tagName.toLowerCase() !== 'a' && count < 10) {
        target = target && target.parentNode;
        ++count;
      }
      var uri = target.href;
      if (typeof uri !== 'undefined') {
        event.preventDefault();
        this.setState({
          currentUri: this.state.currentUri === uri ? null : uri
        });
        return false;
      }
    },
    render: function() {
      return React.createElement('div', {
        className: 'screenshots'
      }, this.state.screenshots.map(function(screenshot) {
        screenshot.uri = (function(uri) {
          var anchor = document.createElement('a');
          anchor.href = uri
          return anchor.href;
        })(screenshot.uri);
        return React.createElement(ScreenshotComponent, {
          enabled: this.state.currentUri === screenshot.uri,
          key: screenshot.uri,
          onClick: this.handleClickScreenshot,
          screenshot: screenshot
        });
      }.bind(this)));
    }
  });

  var ScreenshotComponent = React.createClass({
    displayName: 'ScreenshotComponent',
    propTypes: {
      enabled: React.PropTypes.bool.isRequired,
      onClick: React.PropTypes.func,
      screenshot: React.PropTypes.arrayOf(React.PropTypes.shape({
        createdAt: React.PropTypes.string,
        height: React.PropTypes.number,
        uri: React.PropTypes.string.isRequired,
        width: React.PropTypes.number
      }))
    },
    getDefaultProps: function() {
      enabled: false
    },
    handleClick: function(event) {
      if (typeof this.props.onClick === 'function') {
        return this.props.onClick(event);
        return this.props.onClick.call(this, event);
      }
    },
    componentWillReceiveProps: function(nextProps) {
      var root = root || document.querySelector(':root');
      if (!this.props.enabled && nextProps.enabled) {
        root.classList.add('overlay-enabled');
      } else if (this.props.enabled && !nextProps.enabled) {
        root.classList.remove('overlay-enabled');
      }
    },
    render: function() {
      var screenshot = this.props.screenshot;
      return React.createElement('div', {
        className: 'screenshot' + (this.props.enabled ? ' enabled' : '')
      }, React.createElement('a', {
        href: screenshot.uri,
        onClick: this.handleClick
      }, React.createElement('div', {
        className: 'image',
        style: {
          backgroundImage: 'url("' + screenshot.uri + '")'
        }
      })));
    }
  });

  ReactDOM.render(React.createElement(ApplicationComponent, null), document.getElementById('app'));
})();
