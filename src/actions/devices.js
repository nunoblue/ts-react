import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    TENANT_DEVICES,
    TENANT_DEVICES_SUCCESS,
    TENANT_DEVICES_FAILURE,
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const DEVICES_URL = `${apServer}/api/tenant/devices`;

function getDevices() {
    return {
        type: TENANT_DEVICES,
    };
}

function getDevicesSuccess(data) {
    return {
        type: TENANT_DEVICES_SUCCESS,
        data,
    };
}

function getDevicesFailure() {
    return {
        type: TENANT_DEVICES_FAILURE,
    };
}

export const getDevicesRequest = (limit, textSearch) => (dispatch) => {
    dispatch(getDevices());

    return axios.get(DEVICES_URL, {
        params: { limit, textSearch },
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getDevicesSuccess(response.data.data));
    }).catch((error) => {
        dispatch(getDevicesFailure());
    });
};
