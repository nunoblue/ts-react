import axios from 'axios';
import storage from 'store/storages/localStorage';
// import jwtDecode from 'jwt-decode';

import {
    TENANT_DEVICES,
    TENANT_DEVICES_SUCCESS,
    TENANT_DEVICES_FAILURE,

} from './ActionTypes';

// import { isJwtTokenValid } from './authentication';

import config from '../config';

const apServer = config.apServer;
const DEVICE_URL = `${apServer}/api/tenant/devices`;

export const getDevicesRequest = (limit, textSearch) =>  {
    return (dispatch) =>  {
        dispatch(getDevices());

        let params = {
            limit: limit,
            textSearch: textSearch
        }

        return axios.get(DEVICE_URL, {
            params: params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
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