import { LocaleProvider } from 'antd';
import koKR from 'antd/lib/locale-provider/ko_KR';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const rootElement = document.getElementById('root');
ReactDOM.render(
    <LocaleProvider locale={koKR}>
        <App />
    </LocaleProvider>,
    rootElement);

