import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(XHR) // backend load
    .use(LanguageDetector)
    .init({
        lngs: ['en-US', 'ko_KR', 'ru_RU', 'zh_CN'],
        backend: {
            loadPath: 'locales/{{lng}}/{{ns}}.json', // backend load
        },
        load: 'currentOnly',
        fallbackLng: 'ko_KR',
        react: {
            // wait: false, // set to true if you like to wait for loaded in every translated hoc
            // nsMode: 'default', // set it to fallback to let passed namespaces to translated hoc act as fallbacks
        },
        ns: [
            'access',
            'action',
            'admin',
            'aggregation',
            'attribute',
            'common',
            'confirm-on-exit',
            'contact',
            'customer',
            'dashboard',
            'datakey',
            'datasource',
            'datetime',
            'details',
            'device',
            'dialog',
            'error',
            'event',
            'fullscreen',
            'function',
            'grid',
            'help',
            'home',
            'import',
            'item',
            'js-func',
            'language',
            'legend',
            'login',
            'plugin',
            'position',
            'profile',
            'rule-plugin',
            'rule',
            'tenant',
            'timeinterval',
            'timewindow',
            'user',
            'value',
            'widget-bundle',
            'widget-config',
            'widget-type',
            'widget',
        ],

    });

export default i18n;
