import update from 'react-addons-update';

import {
    TENANT_DEVICES,
    TENANT_DEVICES_SUCCESS,
    TENANT_DEVICES_FAILURE,
    API_SAVE_DEVICE_SUCCESS,
    API_DELETE_DEVICE_SUCCESS,
    API_DEVICE_TYPES,
 } from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    errorMessage: 'NONE',
    types: [],
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
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_SAVE_DEVICE_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_DELETE_DEVICE_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_DEVICE_TYPES:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                types: {
                    $set: action.types,
                },
            });
        default:
            return state;
    }
}
