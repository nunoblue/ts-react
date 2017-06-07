import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import '../less/app.less';
import App from './containers/App';
import rootReducer from './reducers';

injectTapEventPlugin();

let store;
let enhancer = applyMiddleware(thunkMiddleware);
if(process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
    let reduxDevtool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); // Chrome Extension Redux Devtools
    store = createStore(rootReducer, compose(enhancer, reduxDevtool));
} else {
    store = createStore(rootReducer, enhancer);
}

const rootElement = document.getElementById('root');
const render = (Component) => {
    ReactDOM.render(
        <Provider store={store}>
            <AppContainer>
                <MuiThemeProvider>
                    <Component />
                </MuiThemeProvider>
            </AppContainer>
        </Provider>
        , rootElement,
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./containers/App', () => {
        render(App);
    });
}
