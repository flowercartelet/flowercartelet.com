import React from 'react';
import snakeCase from 'lodash.snakecase';
import GoogleAnalyticsTrackingCodeComponent from './GoogleAnalyticsTrackingCodeComponent';
import manifest from '../../asset/manifest';

export default class RootComponent extends React.Component {
  static defaultProps = {
    author: {
      email: 'flowercartelet@gmail.com',
      name: 'Lily Cartelet',
      twitterScreenName: '@flowercartelet'
    },
    currentTitle: 'かーたん (Lily Cartelet) のほーむぺーじ',
    currentUri: 'https://flowercartelet.com/',
    description: 'FINAL FANTASY XIV (Fenrirサーバー) で学者を主に使っているLily Carteletのウェブサイトです。FINAL FANTASY XIVの個人的なスクリーンショットを置くための場所です。',
    image: {
      height: 540,
      type: 'image/jpeg',
      uri: 'https://flowercartelet.com/image/hero.jpeg',
      width: 1280
    },
    keywords: ['Lily Cartelet', 'FINAL FANTASY XIV', 'FF14', 'Fenrir'],
    locale: 'ja-jp',
    screenshotListUri: 'https://screenshot.flowercartelet.com/index.json',
    shortDescription: 'FINAL FANTASY XIV (Fenrirサーバー) で学者を主に使っているLily Carteletのウェブサイトです。'
  };
  static displayName = 'RootComponent';
  static propTypes = {
    author: React.PropTypes.shape({
      email: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      twitterScreenName: React.PropTypes.string
    }),
    currentTitle: React.PropTypes.string.isRequired,
    currentUri: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    image: React.PropTypes.shape({
      height: React.PropTypes.number,
      type: React.PropTypes.string,
      uri: React.PropTypes.string,
      width: React.PropTypes.number
    }),
    keywords: React.PropTypes.arrayOf(React.PropTypes.string),
    locale: React.PropTypes.string.isRequired,
    markup: React.PropTypes.string,
    screenshotListUri: React.PropTypes.string.isRequired,
    shortDescription: React.PropTypes.string
  };

  getViewPort() {
    return {
      'initial-scale': '1.0',
      'maximum-scale': '1.0',
      'minimum-scale': '1.0',
      'user-scalable': 'no',
      'width': 'device-width'
    };
  }

  render() {
    return (
      <html data-screenshot-list-uri={this.props.screenshotListUri} lang={this.props.locale}>
        <head prefix='og: http://ogp.me/ns#'>
          <meta charSet='UTF-8'/>
          <meta content={this.props.author.name} name='author'/>
          <meta content={this.props.description} name='description'/>
          {this.props.keywords && this.props.keywords.length > 0 &&
            <meta content={this.props.keywords.join(',')} name='keywords'/>}
          <meta content='unsafe-url' name='referrer'/>
          <meta content={(this.props.image && this.props.image.uri) ? 'summary_large_image' : 'summary'} name='twitter:card'/>
          <meta content={this.props.shortDescription} name='twitter:description'/>
          {this.props.image && this.props.image.uri &&
            <meta content={this.props.image.uri} name='twitter:image'/>}
          {this.props.image && this.props.image.height &&
            <meta content={this.props.image.height} name='twitter:image:height'/>}
          {this.props.image && this.props.image.width &&
            <meta content={this.props.image.width} name='twitter:image:width'/>}
          {this.props.author.twitterScreenName &&
            <meta content={this.props.author.twitterScreenName} name='twitter:creator'/>}
          <meta content={this.props.currentTitle} name='twitter:title'/>
          <meta content={Object.entries(this.getViewPort()).map(([key, value]) => `${key}=${value}`).join(',')} name='viewport'/>
          {(this.props.shortDescription || this.props.description) &&
            <meta content={this.props.shortDescription || this.props.description} property='og:description'/>}
          {this.props.image && this.props.image.uri &&
            <meta content={this.props.image.uri} property='og:image'/>}
          {this.props.image && this.props.image.type &&
            <meta content={this.props.image.type} property='og:image:type'/>}
          {this.props.image && this.props.image.height &&
            <meta content={this.props.image.height} property='og:image:height'/>}
          {this.props.image && this.props.image.width &&
            <meta content={this.props.image.width} property='og:image:width'/>}
          <meta content={snakeCase(this.props.locale)} property='og:locale'/>
          <meta content={this.props.currentTitle} property='og:title'/>
          <meta content='website' property='og:type'/>
          <meta content={this.props.currentUri} property='og:url'/>
          <link href={`mailto:${this.props.author.email}`} rel='author'/>
          <link href={this.props.currentUri} rel='canonical'/>
          <link href={manifest['style.css']} rel='stylesheet'/>
          <link href='/favicon.ico' rel='icon' type='image/vnd.microsoft.icon'/>
          <title>
            {this.props.currentTitle}
          </title>
          <script
            async={true}
            crossOrigin='anonymous'
            src='//use.fonticons.com/24b020d8.js'
          />
          <GoogleAnalyticsTrackingCodeComponent/>
        </head>
        <body>
          <div id='app' dangerouslySetInnerHTML={{ __html: this.props.markup }}/>
          <script async={true} src={manifest['script.js']}/>
        </body>
      </html>
    );
  }
}
