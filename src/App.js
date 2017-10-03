import React from 'react';
import { object } from 'prop-types';
import { addLocaleData, IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import enUS from 'antd/lib/locale-provider/en_US';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import routes from './routes';
import enTranslationMessages from './translations/en.json';
import translationMessages from './translations';

addLocaleData([...es, ...en]);

const language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
//const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;


const propTypes = {
  store: object.isRequired,
  history: object.isRequired
};

const App = ({ store, history }) => {
  let DevTools = '';
  if (process.env.NODE_ENV !== 'production') {
    DevTools = require('./containers/DevTools').default; // eslint-disable-line global-require
  }

  //console.log(esTranslationMessages.YouthProtection.retakeCourse);

  return (
    <LocaleProvider locale={enUS}>
      <Provider store={store}>
        <IntlProvider
          locale={'es'}
          messages={translationMessages.es}
        >
          <ConnectedRouter history={history}>
            <div>
              {routes}
              {(!window.devToolsExtension) && (process.env.NODE_ENV !== 'production') && <DevTools />}
            </div>
          </ConnectedRouter>
        </IntlProvider>
      </Provider>
    </LocaleProvider>
  );
};

App.propTypes = propTypes;

export default App;
