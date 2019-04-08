import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { store, persistor, history } from './store';

ReactDOM.render(<App store={store} persistor={persistor} history={history} />, document.getElementById('app'));
