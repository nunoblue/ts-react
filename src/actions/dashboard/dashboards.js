import {
    TENANT_DASHBOARDS,
    TENANT_DASHBOARDS_SUCCESS,
    TENANT_DASHBOARDS_FAILURE,
    API_GET_DASHBOARD_SUCCESS,
    API_SAVE_DASHBOARD_SUCCESS,
    API_DELETE_DASHBOARD_SUCCESS,
    API_GET_SERVERTIME_SUCCESS,
    CLEAR_DASHBOARDS,
 } from './DashboardsTypes';
import { dashboardService } from '../../services/api';

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

function getServerTimeDiffSuccess(stDiff) {
    return {
        type: API_GET_SERVERTIME_SUCCESS,
        stDiff,
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
        return dashboardService.getTenantDashboards(limit, textSearch).then((response) => {
            dispatch(getDashboardsSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.message));
        });
    }
    return dashboardService.getCustomerDashboards(limit, textSearch, id).then((response) => {
        dispatch(getDashboardsSuccess(response.data.data));
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.message));
    });
};

export const getDashboardRequest = (id) => {
    return (dispatch) => {
        dispatch(getDashboards());
        return dashboardService.getDashboard(id).then((response) => {
            dispatch(getDashboardSuccess(response.data));
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.message));
        });
    };
};

export const saveDashboardRequest = (data) => {
    return (dispatch) => {
        dispatch(getDashboards());
        return dashboardService.saveDashboard(data).then(() => {
            dispatch(saveDashboardSuccess());
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.message));
        });
    };
};

export const deleteDashboardRequest = (id) => {
    return (dispatch) => {
        dispatch(getDashboards());
        return dashboardService.deleteDashboard(id).then(() => {
            dispatch(deleteDashboardSuccess());
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.message));
        });
    };
};

export const multipleDeleteDashboardRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getDashboards());
        return dashboardService.multipleDeleteDashboard(idArray).then(() => {
            dispatch(deleteDashboardSuccess());
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.message));
        });
    };
};

export const getServerTimeDiffRequest = () => {
    return (dispatch) => {
        dispatch(getDashboards());
        const ts = Date.now();
        return dashboardService.getServerTime().then((response) => {
            const ts1 = Date.now();
            const st = response.data;
            const stDiff = Math.ceil(st - ((ts + ts1) / 2));
            dispatch(getServerTimeDiffSuccess(stDiff));
        }).catch((error) => {
            dispatch(getDashboardsFailure(error.message));
        });
    };
};

export const clearDashboardsRequest = () => (dispatch) => {
    dispatch(clearDashboardsSuccess());
};
