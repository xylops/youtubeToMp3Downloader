import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom'
// import {  Redirect, Router } from 'react-router'

//Redux dependencies
import { applyMiddleware, compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import rootReducer from './redux/reducer'

import PublicLayout from './component/PublicLayout'
import MainPage from './component/MainPage'
import SettingPage from './component/SettingPage'
import DownloadPage from './component/DownloadPage'

import history from './utils/history'

let middlewares = []
middlewares.push(thunk);
// middlewares.push(logger);

let initialState = {}
let store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middlewares),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<HashRouter history={history}>
					<PublicLayout>
						<Route path="/" exact render={() => <MainPage />} />
						<Route path="/download" render={() => <DownloadPage />} />
						<Route path="/setting" render={() => <SettingPage />} />
					</PublicLayout>
				</HashRouter>
`			</Provider>
		);
	}
}

export default App;
