import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    API_PLUGINS,
    API_PLUGINS_SUCCESS,
    API_PLUGINS_FAILURE,
    CLEAR_PLUGINS,
    API_PLUGIN_DELETE_SUCCESS,
    API_PLUGIN_ACTIVATE_SUCCESS,
    API_PLUGIN_SUCCESS,
} from './PluginsTypes';

import config from '../../config';

const { apServer, apiHeaderPrefix } = config;
const API_PLUGIN_URL = `${apServer}/api/plugin`;
const API_PLUGINS_URL = `${apServer}/api/plugins`;
const xAuthorization = `${apiHeaderPrefix} ${storage.read('jwt_token')}`;

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

function getPluginApiFailure(errorMessage) {
    return {
        type: API_PLUGINS_FAILURE,
        errorMessage,
    };
}

function getPluginApiSuccess() {
    return {
        type: API_PLUGIN_SUCCESS,
    };
}

function deletePluginSuccess() {
    return {
        type: API_PLUGIN_DELETE_SUCCESS,
    };
}

function clearPluginsSuccess() {
    return {
        type: CLEAR_PLUGINS,
    };
}

export const getPluginsRequest = () => (dispatch) => {
    dispatch(getPlugins());

    return axios.get(API_PLUGINS_URL, {
        headers: {
            'X-Authorization': `${apiHeaderPrefix} ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getPluginsSuccess(response.data));
    }).catch((error) => {
        dispatch(getPluginApiFailure(error.response.data.message))
    });
};

export const deletePluginsRequest = (idArray) => (dispatch) => {
    dispatch(getPlugins());

    return axios.all(idArray.map(id => axios.delete(
        `${API_PLUGIN_URL}/${id}`, {
            headers: {
                'X-Authorization': `${apiHeaderPrefix} ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(deletePluginSuccess());
        }).catch((error) => {
            dispatch(getPluginApiFailure(error.response.data.message));
        })));
};

export const activatePluginRequest = (id, state) => (dispatch) => {
    dispatch(getPlugins());

    const url = `${API_PLUGIN_URL}/${id}/${state === 'ACTIVE' ? 'suspend' : 'activate'}`;
    return axios.post(url, null, {
       headers: {
           'X-Authorization': xAuthorization,
       },
    }).then((response) => {
        dispatch(getPluginApiSuccess());
    }).catch((error) => {
        dispatch(getPluginApiFailure(error.response.data.message));
    });
};

export const clearPluginsRequest = () => (dispatch) => {
    dispatch(clearPluginsSuccess());
};
