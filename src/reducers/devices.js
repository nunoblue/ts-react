import update from 'react-addons-update';

import {
    TENANT_DEVICES,
    TENANT_DEVICES_SUCCESS,
    TENANT_DEVICES_FAILURE,
    API_SAVE_DEVICE_SUCCESS,
    API_DELETE_DEVICE_SUCCESS,
    API_DEVICE_TYPES,
    API_DEVICE_CREDENTIALS,
    API_ASSIGN_DEVICE_TO_CUSTOMER_SUCCESS,
    API_UNASSIGN_DEVICE_TO_CUSTOMER_SUCCESS,
    API_MAKE_DEVICE_PUBLIC_SUCCESS,
    CLEAR_DEVICES,
 } from '../actions/device/DevicesTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    errorMessage: 'NONE',
    types: [],
    credentials: {},
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
        case API_DEVICE_CREDENTIALS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                credentials: {
                    $set: action.credentials,
                },
            });
        case API_ASSIGN_DEVICE_TO_CUSTOMER_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_UNASSIGN_DEVICE_TO_CUSTOMER_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_MAKE_DEVICE_PUBLIC_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case CLEAR_DEVICES:
            return initialState;
        default:
            return state;
    }
}
