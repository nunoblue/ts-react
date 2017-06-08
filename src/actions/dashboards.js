import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    TENANT_DASHBOARDS,
    TENANT_DASHBOARDS_SUCCESS,
    TENANT_DASHBOARDS_FAILURE,
 } from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const DASHBOARDS_URL = `${apServer}/api/tenant/dashboards`;

function getDashboards() {
    return {
        type: TENANT_DASHBOARDS,
    };
}

function getDashboardsSuccess(data) {
    return {
        type: TENANT_DASHBOARDS_SUCCESS,
        data,
    };
}

function getDashboardsFailure() {
    return {
        type: TENANT_DASHBOARDS_FAILURE,
    };
}

export const getDashboardsRequest = (limit, textSearch) => (dispatch) => {
    dispatch(getDashboards());

    return axios.get(DASHBOARDS_URL, {
        params: { limit, textSearch },
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getDashboardsSuccess(response.data.data));
    }).catch((error) => {
        dispatch(getDashboardsFailure());
    });
};

