import {
    API_PLUGINS,
    API_PLUGINS_SUCCESS,
    API_PLUGINS_FAILURE,
    CLEAR_PLUGINS,
    API_PLUGIN_DELETE_SUCCESS,
    API_PLUGIN_SAVE_SUCCESS,
    API_PLUGIN_SUCCESS,
} from './PluginsTypes';
import { pluginService } from '../../services/api';

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

    return pluginService.getPlugins().then((response) => {
        dispatch(getPluginsSuccess(response.data));
    }).catch((error) => {
        dispatch(getPluginApiFailure(error.message));
    });
};

export const deletePluginsRequest = (idArray) => (dispatch) => {
    dispatch(getPlugins());

    return pluginService.deletePlugins(idArray).then(() => {
        dispatch(deletePluginSuccess());
    }).catch((error) => {
        dispatch(getPluginApiFailure(error.message));
    });
};

export const activatePluginRequest = (id, state) => (dispatch) => {
    dispatch(getPlugins());
    return pluginService.activatePlugin(id, state).then((response) => {
        console.debug('activatePluginRequest is success', response);
        dispatch(getPluginApiSuccess());
    }).catch((error) => {
        dispatch(getPluginApiFailure(error.message));
    });
};

export const savePluginRequest = (plugin) => (dispatch) => {
    dispatch(getPlugins());
    return pluginService.savePlugin(plugin).then((response) => {
        console.debug('savePluginRequest is success', response.data);
        dispatch(getPluginApiSuccess());
    }).catch((error) => {
        dispatch(getPluginApiFailure(error.message));
    });
};

export const clearPluginsRequest = () => (dispatch) => {
    dispatch(clearPluginsSuccess());
};
