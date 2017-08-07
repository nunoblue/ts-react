import update from 'react-addons-update';

import {
    API_ADMINS,
    API_ADMINS_SUCCESS,
    API_ADMINS_FAILURE,
    API_ADMIN_SETTINGS_SAVE,
    CLEAR_ADMINS,
} from '../actions/admin/AdminsTypes';

const initialState = {
    data: {},
    statusMessage: 'INIT',
    errorMessage: 'NONE',
};

export default function admins(state = initialState, action) {
    switch (action.type) {
        case API_ADMINS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });
        case API_ADMINS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data,
                },
            });
        case API_ADMINS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_ADMIN_SETTINGS_SAVE:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case CLEAR_ADMINS:
            return initialState;
        default:
            return state;
    }
}
