import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    API_PLUGINS,
    API_PLUGINS_SUCCESS,
    API_PLUGINS_FAILURE,
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const PLUGINS_URL = `${apServer}/api/plugins`;

function getPlugins() {
    return {
        type: API_PLUGINS,
    };
}

function getPluginsSuccess(data) {
    return {
        type: API_PLUGINS_SUCCESS,
        data,
    };
}

function getPluginsFailure() {
    return {
        type: API_PLUGINS_FAILURE,
    };
}

export const getPluginsRequest = () => (dispatch) => {
    dispatch(getPlugins());

    return axios.get(PLUGINS_URL, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getPluginsSuccess(response.data));
    }).catch((error) => {
        dispatch(getPluginsFailure());
    });
};

