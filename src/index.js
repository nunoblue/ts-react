import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';

import { i18nClient } from './i18n';
import store from './store';
import '../less/app.less';
import App from './containers/App';


const rootElement = document.getElementById('root');
moment.locale(i18nClient.language);
const render = (Component) => {
    ReactDOM.render(
        <Provider store={store()}>
            <AppContainer>
                <Component />
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
