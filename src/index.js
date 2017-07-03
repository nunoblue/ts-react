import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';

import '../less/app.less';
import App from './containers/App';
import i18n from './i18n';
import rootReducer from './reducers';

let store;
const enhancer = applyMiddleware(thunkMiddleware);
if (process.env.NODE_ENV === 'development'
    && window.__REDUX_DEVTOOLS_EXTENSION__
    && window.__REDUX_DEVTOOLS_EXTENSION__()) {
    const reduxDevtool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); // Chrome Extension Redux Devtools
    store = createStore(rootReducer, compose(enhancer, reduxDevtool));
} else {
    store = createStore(rootReducer, enhancer);
}

const rootElement = document.getElementById('root');
const render = (Component) => {
    ReactDOM.render(
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <AppContainer>
                    <Component />
                </AppContainer>
            </Provider>
        </I18nextProvider>
        , rootElement,
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./containers/App', () => {
        render(App);
    });
}
