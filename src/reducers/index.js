import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import { UNAUTH_USER } from '../actions/types';
import homeReducer from './homeReducer';
import subpageReducer from './subpageReducer';
import registerReducer from './registerReducer';
import authReducer from './authReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import teamsReducer from './teamsReducer';
import teamRoomsReducer from './teamRoomsReducer';
import integrationsReducer from './integrationsReducer';
import dialogReducer from './dialogsReducer';

const mainReducer = combineReducers({
  home: homeReducer,
  subpageReducer,
  auth: authReducer,
  registerReducer,
  subscriberOrgs: subscriberOrgsReducer,
  teams: teamsReducer,
  teamRooms: teamRoomsReducer,
  integrations: integrationsReducer,
  form: formReducer,
  router: routerReducer,
  dialogs: dialogReducer
});

const initialState = mainReducer({}, {});

// Clear out redux store upon logout.
const rootReducer = (state, action) => {
  if (action.type === UNAUTH_USER) {
    return mainReducer({ ...initialState, router: state.router }, action);
  }
  return mainReducer(state, action);
};

export default rootReducer;
