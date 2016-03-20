(function() {
  'use script';

  var root;

  function getRoot() {
    root = root || document.querySelector(':root');
    return root;
  }

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

  function getAbsoluteUri(uri) {
    var anchor = document.createElement('a');
    anchor.href = uri;
    return anchor.href;
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
      var target = getRoot();
      var screenshotListUri = target.dataset.screenshotListUri;
      request(screenshotListUri).then(function(connect) {
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
      return React.createElement('section', null, [
        React.createElement('h2', null, 'スクリーンショット'),
        React.createElement('div', {
          className: 'screenshots'
        }, this.state.screenshots.map(function(screenshot) {
          screenshot.images.original.uri = getAbsoluteUri(screenshot.images.original.uri);
          return React.createElement(ScreenshotComponent, {
            enabled: this.state.currentUri === screenshot.images.original.uri,
            key: screenshot.images.original.uri,
            onClick: this.handleClickScreenshot,
            screenshot: screenshot
          });
        }.bind(this)))
      ]);
    }
  });

  var ScreenshotComponent = React.createClass({
    displayName: 'ScreenshotComponent',
    propTypes: {
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
    },
    getDefaultProps: function() {
      return {
        enabled: false
      };
    },
    getImageUri: function() {
      var images = this.props.screenshot.images;
      var size = this.props.enabled ? 'original' : 'thumbnail';
      return images[size].uri;
    },
    handleClick: function(event) {
      if (typeof this.props.onClick === 'function') {
        return this.props.onClick(event);
      }
    },
    componentWillReceiveProps: function(nextProps) {
      var target = getRoot();
      if (!this.props.enabled && nextProps.enabled) {
        target.classList.add('overlay-enabled');
      } else if (this.props.enabled && !nextProps.enabled) {
        target.classList.remove('overlay-enabled');
      }
    },
    render: function() {
      var screenshot = this.props.screenshot;
      var images = screenshot.images;
      return React.createElement('div', {
        className: 'screenshot' + (this.props.enabled ? ' enabled' : '')
      }, React.createElement('a', {
        href: images.original.uri,
        onClick: this.handleClick
      }, React.createElement('div', {
        className: 'image',
        style: {
          backgroundImage: 'url("' + this.getImageUri() + '")'
        }
      })));
    }
  });

  ReactDOM.render(React.createElement(ApplicationComponent, null), document.getElementById('app'));
})();
