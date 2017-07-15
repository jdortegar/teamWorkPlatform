import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import homeReducer from './homeReducer';
import subpageReducer from './subpageReducer';
import registerReducer from './registerReducer';
import authReducer from './authReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import integrationsReducer from './integrationsReducer';

const mainReducer = combineReducers({
  home: homeReducer,
  subpageReducer,
  authReducer,
  registerReducer,
  subscriberOrgs: subscriberOrgsReducer,
  integrations: integrationsReducer,
  form: formReducer,
  router: routerReducer
});

export default mainReducer;
