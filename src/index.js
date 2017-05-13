import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, hashHistory } from 'react-router';
import Routes from './routes';
import reducers from './reducers';
import { Provider } from 'react-redux';
import promise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import '../resources/style/app.css';


/* redux-promise

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
ReactDOM.render(
	<Provider store={createStoreWithMiddleware(reducers)}>
		<Routes />
	</Provider>
	, document.querySelector('.homepage'));
*/

//redux-thunk
const createStoreWithMiddleware = createStore(reducers,{},applyMiddleware(ReduxThunk));
ReactDOM.render(
	<Provider store={createStoreWithMiddleware}>
		<Routes />
	</Provider>
	, document.querySelector('.homepage'));