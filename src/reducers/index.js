import { combineReducers } from 'redux';
import homeReducer from './homeReducer';
import subpageReducer from './subpageReducer';

const mainReducer = combineReducers({
   homeReducer,
   subpageReducer
});

export default mainReducer;

