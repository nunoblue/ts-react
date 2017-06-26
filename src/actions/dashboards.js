import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    TENANT_DASHBOARDS,
    TENANT_DASHBOARDS_SUCCESS,
    TENANT_DASHBOARDS_FAILURE,
    API_SAVE_DASHBOARD_SUCCESS,
    API_DELETE_DASHBOARD_SUCCESS,
 } from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const DASHBOARDS_URL = `${apServer}/api/tenant/dashboards`;
const SAVE_DASHBOARD_URL = `${apServer}/api/dashboard`;
const DELETE_DASHBOARD_URL = `${apServer}/api/dashboard`;

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

function getDashboardsFailure(message) {
    return {
        type: TENANT_DASHBOARDS_FAILURE,
        errorMessage: message,
    };
}

function saveDashboardSuccess() {
    return {
        type: API_SAVE_DASHBOARD_SUCCESS,
    };
}

function deleteDashboardSuccess() {
    return {
        type: API_DELETE_DASHBOARD_SUCCESS,
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
        dispatch(getDashboardsFailure(error.response.data.message));
    });
};

export const saveDashboardRequest = (data) => {
    return (dispatch) => {
        dispatch(getDashboards());

        return axios.post(SAVE_DASHBOARD_URL, data, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(saveDashboardSuccess());
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.response.data.message));
        });
    };
};

export const deleteDashboardRequest = (id) => {
    return (dispatch) => {
        dispatch(getDashboards());

        return axios.delete(`${DELETE_DASHBOARD_URL}/${id}`, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(deleteDashboardSuccess());
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.response.data.message));
        });
    };
};

export const multipleDeleteDashboardRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getDashboards());
        return axios.all(idArray.map((id) => {
            return axios.delete(`${DELETE_DASHBOARD_URL}/${id}`, {
                headers: {
                    'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
                },
            }).then((response) => {
                dispatch(deleteDashboardSuccess());
            }).catch((error) => {
                dispatch(getDashboardsFailure(error.response.data.message));
            });
        }));
    };
};
