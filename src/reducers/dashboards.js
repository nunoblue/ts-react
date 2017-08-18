import update from 'immutability-helper';

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
} from '../actions/dashboard/DashboardsTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    errorMessage: 'NONE',
    dashboard: {},
    stDiff: 0,
};

export default function dashboards(state = initialState, action) {
    switch (action.type) {
        case TENANT_DASHBOARDS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });
        case TENANT_DASHBOARDS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data,
                },
            });
        case TENANT_DASHBOARDS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_GET_DASHBOARD_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                dashboard: {
                    $set: action.dashboard,
                },
            });
        case API_SAVE_DASHBOARD_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_DELETE_DASHBOARD_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_GET_SERVERTIME_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                stDiff: {
                    $set: action.stDiff,
                },
            });
        case API_ASSIGN_DASHBOARD_CUSTOMER:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_UNASSIGN_DASHBOARD_CUSTOMER:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_MAKE_PUBLIC_DASHBOARD:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case CLEAR_DASHBOARDS:
            return initialState;
        default:
            return state;
    }
}
