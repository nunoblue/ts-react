import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import telemetryMiddleware from '../middleware/telemetryMiddleware';
import rootReducer from '../reducers';

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
export default store;
