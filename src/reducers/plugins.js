import update from 'react-addons-update';

import {
    API_PLUGINS,
    API_PLUGINS_SUCCESS,
    API_PLUGINS_FAILURE,
    CLEAR_PLUGINS,
    API_PLUGIN_SAVE_SUCCESS,
    API_PLUGIN_DELETE_SUCCESS,
    API_PLUGIN_SUCCESS,
    API_PLUGIN_COMPONENT_LIST_SUCCCESS,
} from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    errorMessage: 'NONE',
};

export default function plugins(state = initialState, action) {
    switch (action.type) {
        case API_PLUGINS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });
        case API_PLUGINS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data,
                },
            });
        case API_PLUGINS_FAILURE:
            console.log('action', action);
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_PLUGIN_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_PLUGIN_DELETE_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case CLEAR_PLUGINS:
            return initialState;
        default:
            return state;
    }
}
