import update from 'react-addons-update';

import {
    TENANT_DASHBOARDS,
    TENANT_DASHBOARDS_SUCCESS,
    TENANT_DASHBOARDS_FAILURE,
    API_SAVE_DASHBOARD_SUCCESS,
    API_DELETE_DASHBOARD_SUCCESS,
} from '../actions/ActionTypes';

 const initialState = {
     statusMessage: 'INIT',
     data: [],
     errorMessage: 'NONE',
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
        default:
            return state;
    }
}
