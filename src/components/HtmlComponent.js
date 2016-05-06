import React, { Component, PropTypes } from 'react';
import snakeCase from 'lodash.snakecase';

export default class HtmlComponent extends Component {
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
    manifest: {},
    shortDescription: 'FINAL FANTASY XIV (Fenrirサーバー) で学者を主に使っているLily Carteletのウェブサイトです。'
  };
  static displayName = 'HtmlComponent';
  static propTypes = {
    author: PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      twitterScreenName: PropTypes.string
    }),
    currentTitle: PropTypes.string.isRequired,
    currentUri: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.shape({
      height: PropTypes.number,
      type: PropTypes.string,
      uri: PropTypes.string,
      width: PropTypes.number
    }),
    initialState: PropTypes.object,
    keywords: PropTypes.arrayOf(PropTypes.string),
    locale: React.PropTypes.string,
    markup: PropTypes.string,
    manifest: PropTypes.object.isRequired,
    shortDescription: PropTypes.string,
    styleSheet: PropTypes.string
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
    const locale = this.props.locale || 'en';
    return (
      <html lang={locale}>
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
          <meta content={snakeCase(locale)} property='og:locale'/>
          <meta content={this.props.currentTitle} property='og:title'/>
          <meta content='website' property='og:type'/>
          <meta content={this.props.currentUri} property='og:url'/>
          <link href={`mailto:${this.props.author.email}`} rel='author'/>
          <link href={this.props.currentUri} rel='canonical'/>
          {this.props.styleSheet &&
            <style dangerouslySetInnerHTML={{ __html: this.props.styleSheet }}/>}
          <link href='/favicon.ico' rel='icon' type='image/vnd.microsoft.icon'/>
          <title>
            {this.props.currentTitle}
          </title>
        </head>
        <body>
          <div id='app' dangerouslySetInnerHTML={{ __html: this.props.markup }}/>
          <script dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__ = ${JSON.stringify(this.props.initialState)}`
          }}/>
          <script async={true} src={this.props.manifest['script.js']}/>
        </body>
      </html>
    );
  }
}
