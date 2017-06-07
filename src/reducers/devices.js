import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    statusMessage: 'INIT',
    data: []
};

export default function devices(state = initialState, action) {
    switch(action.type) {
        case types.TENANT_DEVICES: 
            return update(state, {
                statusMessage: {
                    $set: 'WAITING'
                }
            });
        case types.TENANT_DEVICES_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS'
                },
                data: {
                    $set: action.data
                }
            });
        case types.TENANT_DEVICES_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE'
                }
            });
        default:
            return state;
    }
}