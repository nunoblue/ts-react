import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import telemetryMiddleware from '../middleware/telemetryMiddleware';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

export default function configureStore() {
    const sagaMiddleware = createSagaMiddleware();
    let store;
    const enhancer = applyMiddleware(thunkMiddleware, sagaMiddleware, telemetryMiddleware);
    if (process.env.NODE_ENV === 'development'
        && window.__REDUX_DEVTOOLS_EXTENSION__
        && window.__REDUX_DEVTOOLS_EXTENSION__()) {
        const reduxDevtool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(); // Chrome Extension Redux Devtools
        store = createStore(rootReducer, compose(enhancer, reduxDevtool));
        sagaMiddleware.run(rootSaga);
    } else {
        store = createStore(rootReducer, enhancer);
    }
    return store;
}
