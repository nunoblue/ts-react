import update from 'react-addons-update';

import {
    API_USERS,
    API_USERS_SUCCESS,
    API_USERS_FAILURE,
    API_SAVE_USERS_SUCCESS,
    API_DELETE_USERS_SUCCESS,
    CLEAR_USERS,
    API_SEND_ACTIVATION_SUCCESS,
} from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    errorMessage: 'NONE',
};

const users = (state = initialState, action) => {
    switch (action.type) {
        case API_USERS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });
        case API_USERS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data,
                },
            });
        case API_USERS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_SAVE_USERS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_DELETE_USERS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_SEND_ACTIVATION_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case CLEAR_USERS:
            return initialState;
        default:
            return state;
    }
};

export default users;
