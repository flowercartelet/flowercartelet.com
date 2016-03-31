(function() {
  'use script';

  var root;

  function getRoot() {
    root = root || document.querySelector(':root');
    return root;
  }

  function getAbsoluteUri(uri) {
    var anchor = document.createElement('a');
    anchor.href = uri;
    return anchor.href;
  }

  function parseJson(response) {
    return response.json();
  }

  var ApplicationComponent = React.createClass({
    displayName: 'ApplicationComponent',
    componentDidMount: function() {
      var target = getRoot();
      var locale = target.lang;
      moment.locale(locale);
    },
    render: function() {
      return React.createElement(
        'div', {
          className: 'ApplicationComponent'
        },
        React.createElement(HeaderComponent, null),
        React.createElement(
          'main',
          null,
          React.createElement(ScreenshotsComponent, null)
        ),
        React.createElement(FooterComponent, null)
      );
    }
  });

  var HeaderComponent = React.createClass({
    displayName: 'HeaderComponent',
    shouldComponentUpdate: function(nextProps, nextState) {
      return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    },
    render: function() {
      return React.createElement(
        'header',
        null,
        React.createElement('h1', null, 'かーたんのほーむぺーじ'),
        React.createElement(
          'p', {
            className: 'description'
          },
          'FINAL FANTASY XIV (Fenrirサーバー) で学者を主に使っている',
          React.createElement(
            'em',
            null,
            'Lily Cartelet'
          ),
          'のウェブサイトです。FINAL FANTASY XIVの個人的なスクリーンショットを置くための場所です。'
        ), React.createElement(
          'nav',
          null,
          React.createElement(
            'ul',
            null,
            React.createElement(
              'li',
              null,
              React.createElement(
                'a', {
                  className: 'share twitter',
                  href: 'https://twitter.com/flowercartelet'
                },
                React.createElement('i', {
                  className: 'fa fa-twitter'
                }),
                ' Twitter'
              )
            ),
            React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                {
                  className: 'share lodestone',
                  href: 'http://jp.finalfantasyxiv.com/lodestone/character/3244798/'
                },
                'Lodestone ',
                React.createElement('i', {
                  className: 'fa fa-external-link'
                })
              )
            )
          )
        )
      );
    }
  });

  var FooterComponent = React.createClass({
    displayName: 'FooterComponent',
    shouldComponentUpdate: function(nextProps, nextState) {
      return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    },
    render: function() {
      return React.createElement(
        'footer',
        null,
        React.createElement(
          'p',
          {
            className: 'copyright'
          },
          'Copyright © 2016 ',
          React.createElement('a', {
            href: 'mailto:flowercartelet@gmail.com',
            rel: 'author'
          }, 'Lily Cartelet')
        )
      );
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
      fetch(screenshotListUri).then(parseJson).then(function(response) {
        this.setState({
          enabledUri: null,
          screenshots: response
        });
      }.bind(this));
    },
    shouldComponentUpdate: function(nextProps, nextState) {
      return (
        this.state.currentUri !== nextState.currentUri ||
        !_.isEqual(this.state.screenshots, nextState.screenshots)
      );
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
      return React.createElement(
        'section',
        null,
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
      );
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
    shouldComponentUpdate: function(nextProps) {
      return this.props.enabled !== nextProps.enabled;
    },
    render: function() {
      var screenshot = this.props.screenshot;
      var images = screenshot.images;
      return React.createElement(
        'div',
        {
          className: 'screenshot' + (this.props.enabled ? ' enabled' : '')
        },
        React.createElement(
          'a', {
            href: images.original.uri,
            onClick: this.handleClick
          },
          React.createElement(
            'div',
            {
              className: 'image',
              style: {
                backgroundImage: 'url("' + this.getImageUri() + '")'
              }
            },
            React.createElement(
              'time',
              {
                dateTime: screenshot.createdAt,
              },
              React.createElement('i', {
                className: 'fa fa-clock-o'
              }),
              ' ' + moment(screenshot.createdAt).fromNow()
            )
          )
        )
      );
    }
  });

  ReactDOM.render(
    React.createElement(ApplicationComponent, null),
    document.getElementById('app')
  );
})();
