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

export const getDevicesRequest = (limit, textSearch) =>  {
    return (dispatch) =>  {
        dispatch(getDevices());

        let params = {
            limit: limit,
            textSearch: textSearch
        }

        return axios.get(DEVICES_URL, {
            params: params,
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(getDevicesSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getDevicesFailure());
        });
    };
};

function getDevices() {
    return {
        type: TENANT_DEVICES
    }
}

function getDevicesSuccess(data) {
    return {
        type: TENANT_DEVICES_SUCCESS,
        data: data
    }
}

function getDevicesFailure() {
    return {
        type: TENANT_DEVICES_FAILURE
    }
}