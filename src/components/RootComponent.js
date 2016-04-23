import React, { Component, PropTypes } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import jaLocaleData from 'react-intl/locale-data/ja';
import { Provider as ReduxProvider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

addLocaleData([...enLocaleData, ...jaLocaleData]);

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

export default class RootComponent extends Component {
  static defaultProps = {
    locale: 'en'
  };
  static displayName = 'RootComponent';
  static propTypes = {
    locale: React.PropTypes.string.isRequired
  };

  render() {
    const { locale } = this.props;
    return (
      <ReduxProvider store={store}>
        <IntlProvider locale={locale}>
          {this.props.children}
        </IntlProvider>
      </ReduxProvider>
    );
  }
}
