'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import '../less/app.less';
import App from './containers/App';
import rootReducer from './reducers';

const enhancer = applyMiddleware(thunkMiddleware); // 함수를 dispatch()하게 해줌
const reduxDevtool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); // Chrome Extension Redux Devtools
const store = createStore(rootReducer, compose(enhancer, reduxDevtool));

let rootElement = document.getElementById('root');
const render = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <AppContainer>
                <MuiThemeProvider>
                    <Component />
                </MuiThemeProvider>
            </AppContainer>
        </Provider>
        , rootElement
    );
}

render(App);

if (module.hot) {
    module.hot.accept('./containers/App', () => {
        render(App);
    });
}