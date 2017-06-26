import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    TENANT_DEVICES,
    TENANT_DEVICES_SUCCESS,
    TENANT_DEVICES_FAILURE,
    API_SAVE_DEVICE_SUCCESS,
    API_DELETE_DEVICE_SUCCESS,
    API_DEVICE_TYPES,
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const DEVICES_URL = `${apServer}/api/tenant/devices`;
const DEVICE_TYPES_URL = `${apServer}/api/device/types`;
const SAVE_DEVICE_URL = `${apServer}/api/device`;
const DELETE_DEVICE_URL = `${apServer}/api/device`;

function getDevices() {
    return {
        type: TENANT_DEVICES,
    };
}

function getDeviceTypes(data) {
    return {
        type: API_DEVICE_TYPES,
        types: data,
    };
}

function getDevicesSuccess(data) {
    return {
        type: TENANT_DEVICES_SUCCESS,
        data,
    };
}

function getDevicesFailure(message) {
    return {
        type: TENANT_DEVICES_FAILURE,
        errorMessage: message,
    };
}

function saveDeviceSuccess() {
    return {
        type: API_SAVE_DEVICE_SUCCESS,
    };
}

function deleteDeviceSuccess() {
    return {
        type: API_DELETE_DEVICE_SUCCESS,
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
        dispatch(getDevicesFailure(error.reponse.data.message));
    });
};

export const getDeviceTypesRequest = () => (dispatch) => {
    dispatch(getDevices());

    return axios.get(DEVICE_TYPES_URL, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getDeviceTypes(response.data));
    }).catch((error) => {
        dispatch(getDevicesFailure(error.response.data.message));
    });
};

export const saveDeviceRequest = (data) => {
    return (dispatch) => {
        dispatch(getDevices());

        return axios.post(SAVE_DEVICE_URL, data, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(saveDeviceSuccess());
        }).catch((error) => {
            dispatch(getDevicesFailure(error.response.data.message));
        });
    };
};

export const deleteDeviceRequest = (id) => {
    return (dispatch) => {
        dispatch(getDevices());

        return axios.delete(`${DELETE_DEVICE_URL}/${id}`, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(deleteDeviceSuccess());
        }).catch((error) => {
            dispatch(getDevicesFailure(error.response.data.message));
        });
    };
};

export const multipleDeleteDeviceRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getDevices());
        return axios.all(idArray.map((id) => {
            return axios.delete(`${DELETE_DEVICE_URL}/${id}`, {
                headers: {
                    'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
                },
            }).then((response) => {
                dispatch(deleteDeviceSuccess());
            }).catch((error) => {
                dispatch(getDevicesFailure(error.response.data.message));
            });
        }));
    };
};
