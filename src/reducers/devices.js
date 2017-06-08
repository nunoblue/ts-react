import update from 'react-addons-update';

import {
    TENANT_DEVICES,
    TENANT_DEVICES_SUCCESS,
    TENANT_DEVICES_FAILURE,
 } from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
};

export default function devices(state = initialState, action) {
    switch (action.type) {
        case TENANT_DEVICES:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });
        case TENANT_DEVICES_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data,
                },
            });
        case TENANT_DEVICES_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
            });
        default:
            return state;
    }
}
