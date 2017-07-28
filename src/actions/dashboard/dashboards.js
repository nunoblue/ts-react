import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    TENANT_DASHBOARDS,
    TENANT_DASHBOARDS_SUCCESS,
    TENANT_DASHBOARDS_FAILURE,
    API_GET_DASHBOARD_SUCCESS,
    API_SAVE_DASHBOARD_SUCCESS,
    API_DELETE_DASHBOARD_SUCCESS,
    CLEAR_DASHBOARDS,
} from './DashboardsTypes';

import config from '../../config';

const apServer = config.apServer;
export const TENANT_DASHBOARDS_URL = `${apServer}/api/tenant/dashboards`;
const GET_DASHBOARD_URL = `${apServer}/api/dashboard`;
const CUSTOMER_DASHBOARDS_URL = `${apServer}/api/customer`;
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

function getDashboardSuccess(data) {
    return {
        type: API_GET_DASHBOARD_SUCCESS,
        dashboard: data,
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

function clearDashboardsSuccess() {
    return {
        type: CLEAR_DASHBOARDS,
    };
}

export const getDashboardsRequest = (limit, textSearch, authority, id) => (dispatch) => {
    dispatch(getDashboards());
    if (authority === 'TENANT_ADMIN') {
        return axios.get(TENANT_DASHBOARDS_URL, {
            params: {limit, textSearch},
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(getDashboardsSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.response.data.message));
        });
    }
    return axios.get(`${CUSTOMER_DASHBOARDS_URL}/${id}/dashboards`, {
        params: {limit, textSearch},
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getDashboardsSuccess(response.data.data));
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.response.data.message));
    });
};

export const getDashboardRequest = id => (dispatch) => {
    dispatch(getDashboards());

    return axios.get(`${GET_DASHBOARD_URL}/${id}`, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getDashboardSuccess(response.data));
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.response.data.message));
    });
};

export const saveDashboardRequest = data => (dispatch) => {
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

export const deleteDashboardRequest = id => (dispatch) => {
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

export const multipleDeleteDashboardRequest = idArray => (dispatch) => {
    dispatch(getDashboards());
    return axios.all(idArray.map(id => axios.delete(`${DELETE_DASHBOARD_URL}/${id}`, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(deleteDashboardSuccess());
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.response.data.message));
    })));
};


export const multipleAssignDashboardToCustomer = (customerId, idArray) => (dispatch) => {
    dispatch(getDashboards());
    return axios.all(idArray.map(id => axios.post(`${CUSTOMER_DASHBOARDS_URL}/${customerId}/dashboard/${id}`, null, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(saveDashboardSuccess());
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.response.data.message));
    })));
};

export const clearDashboardsRequest = () => (dispatch) => {
    dispatch(clearDashboardsSuccess());
};
