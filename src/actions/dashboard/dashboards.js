import {
    TENANT_DASHBOARDS,
    TENANT_DASHBOARDS_SUCCESS,
    TENANT_DASHBOARDS_FAILURE,
    API_GET_DASHBOARD_SUCCESS,
    API_SAVE_DASHBOARD_SUCCESS,
    API_DELETE_DASHBOARD_SUCCESS,
    API_GET_SERVERTIME_SUCCESS,
    API_ASSIGN_DASHBOARD_CUSTOMER,
    API_MAKE_PUBLIC_DASHBOARD,
    API_UNASSIGN_DASHBOARD_CUSTOMER,
    CLEAR_DASHBOARDS,
 } from './DashboardsTypes';
import { dashboardService } from '../../services/api';
import config from '../../configs';

const getDashboards = () => {
    return {
        type: TENANT_DASHBOARDS,
    };
};

const getDashboardsSuccess = (data) => {
    return {
        type: TENANT_DASHBOARDS_SUCCESS,
        data,
    };
};

const getDashboardsFailure = (message) => {
    return {
        type: TENANT_DASHBOARDS_FAILURE,
        errorMessage: message,
    };
};

const getDashboardSuccess = (data) => {
    return {
        type: API_GET_DASHBOARD_SUCCESS,
        dashboard: data,
    };
};

const saveDashboardSuccess = () => {
    return {
        type: API_SAVE_DASHBOARD_SUCCESS,
    };
};

const deleteDashboardSuccess = () => {
    return {
        type: API_DELETE_DASHBOARD_SUCCESS,
    };
};

const getServerTimeDiffSuccess = (stDiff) => {
    return {
        type: API_GET_SERVERTIME_SUCCESS,
        stDiff,
    };
};

const assignDashboardToCustomerSuccess = () => {
    return {
        type: API_ASSIGN_DASHBOARD_CUSTOMER,
    };
};

const unassignDashboardToCustomerSuccess = () => {
    return {
        type: API_UNASSIGN_DASHBOARD_CUSTOMER,
    };
};

const makeDashboardPublicSuccess = () => {
    return {
        type: API_MAKE_PUBLIC_DASHBOARD,
    };
};

const clearDashboardsSuccess = () => {
    return {
        type: CLEAR_DASHBOARDS,
    };
};

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

export const assignDashboardToCustomerRequest = (customerId, dashboardId) => (dispatch) => {
    dispatch(getDashboards());
    return dashboardService.assignDashboardToCustomer(customerId, dashboardId).then(() => {
        dispatch(assignDashboardToCustomerSuccess());
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.message));
    });
};

export const multipleAssignDashboardToCustomerRequest = (customerId, dashboardIdArray) => (dispatch) => {
    dispatch(getDashboards());
    return dashboardService.multipleAssignDashboardToCustomer(customerId, dashboardIdArray).then(() => {
        dispatch(assignDashboardToCustomerSuccess());
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.message));
    });
};

export const unassignDashboardToCustomerRequest = dashboardId => (dispatch) => {
    dispatch(getDashboards());
    return dashboardService.unassignDashboardToCustomer(dashboardId).then(() => {
        dispatch(unassignDashboardToCustomerSuccess());
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.message));
    });
};

export const makeDashboardPublicRequest = dashboardId => (dispatch) => {
    dispatch(getDashboards());
    return dashboardService.makeDashboardPublic(dashboardId).then(() => {
        dispatch(makeDashboardPublicSuccess());
    }).catch((error) => {
        dispatch(getDashboardsFailure(error.message));
    });
};

export const clearDashboardsRequest = () => (dispatch) => {
    dispatch(clearDashboardsSuccess());
};

export const getPublicDashboardLinkRequest = (dashboardId, customerId) => {
    let url = config.locationUrl;
    url += `/dashboards/${dashboardId}?publicId=${customerId}`;
    return url;
};
