import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    API_WIDGETS,
    API_WIDGETS_SUCCESS,
    API_WIDGETS_FAILURE,
    CLEAR_WIDGETS,
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const WIDGETS_URL = `${apServer}/api/widgetsBundles`;

function getWidgets() {
    return {
        type: API_WIDGETS,
    };
}

function getWidgetsSuccess(data) {
    return {
        type: API_WIDGETS_SUCCESS,
        data,
    };
}

function getWidgetsFailure() {
    return {
        type: API_WIDGETS_FAILURE,
    };
}

function clearWidgetsSuccess() {
    return {
        type: CLEAR_WIDGETS,
    };
}

export const getWidgetsRequest = () => (dispatch) => {
    dispatch(getWidgets());

    return axios.get(WIDGETS_URL, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getWidgetsSuccess(response.data));
    }).catch((error) => {
        dispatch(getWidgetsFailure());
    });
};

export const clearWidgetsRequest = () => (dispatch) => {
    dispatch(clearWidgetsSuccess());
};
