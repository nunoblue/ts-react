import { 
    TENANT_DASHBOARDS,
    TENANT_DASHBOARDS_SUCCESS,
    TENANT_DASHBOARDS_FAILURE
 } from '../actions/ActionTypes';
 import update from 'react-addons-update';

 const initialState = {
     statusMessage: 'INIT',
     data: []
 }

export default function dashboards(state = initialState, action) {
    switch(action.type) {
        case TENANT_DASHBOARDS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING'
                }
            });
        case TENANT_DASHBOARDS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data
                }
            });
        case TENANT_DASHBOARDS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE'
                }
            });
        default:
            return state;
    }
};

