import {
    TENANT_DEVICES,
    TENANT_DEVICES_SUCCESS,
    TENANT_DEVICES_FAILURE,

} from './ActionTypes';

// import { isJwtTokenValid } from './authentication';

import axios from 'axios';
import storage from 'store/storages/localStorage';
import jwtDecode from 'jwt-decode';

export function getDevicesRequest(limit, textSearch) {
    return (dispatch) => new Promise((resolve, reject) => {
        let params = {
            limit: limit,
            textSearch: textSearch
        }

        axios.get('http://localhost:8080/api/tenant/devices', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Authorization': 'Bearer ' + storage.read('jwt_token')
            },
            params: params,
        }).then((response) => {
            dispatch(getDevicesSuccess(response.data.data));
            resolve(response);
        }).catch((error) => {
            dispatch(getDevicesFailure());
            reject(error);
        });
    })
}

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