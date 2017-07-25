import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import moment from 'moment';
import telemetryMiddleware from './middleware/telemetryMiddleware';
import '../less/app.less';
import App from './containers/App';
import { i18nClient } from './i18n';
import rootReducer from './reducers';


let store;
const enhancer = applyMiddleware(thunkMiddleware, telemetryMiddleware);
if (process.env.NODE_ENV === 'development'
    && window.__REDUX_DEVTOOLS_EXTENSION__
    && window.__REDUX_DEVTOOLS_EXTENSION__()) {
    const reduxDevtool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); // Chrome Extension Redux Devtools
    store = createStore(rootReducer, compose(enhancer, reduxDevtool));
} else {
    store = createStore(rootReducer, enhancer);
}

const rootElement = document.getElementById('root');
moment.locale(i18nClient.language);
const render = (Component) => {
    ReactDOM.render(
        <I18nextProvider i18n={i18nClient}>
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
