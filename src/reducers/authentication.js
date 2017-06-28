import update from 'react-addons-update';

import {
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT,
    API_GET_USER_SUCCESS,
    API_GET_USER_FAILURE,
} from '../actions/ActionTypes';

const initialState = {
    login: {
        statusMessage: 'INIT',
    },
    validate: {
        statusMessage: 'INIT',
    },
    currentUser: {},
};

export default function authentication(state = initialState, action) {
    switch (action.type) {
        /* LOGIN */
        case AUTH_LOGIN:
            return update(state, {
                login: {
                    statusMessage: {
                        $set: 'WAITING',
                    },
                },
            });
        case AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    statusMessage: {
                        $set: 'SUCCESS',
                    },
                },
            });
        case AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    statusMessage: {
                        $set: 'FAILURE',
                    },
                },
            });
        case AUTH_GET_STATUS:
            return update(state, {
                validate: {
                    statusMessage: {
                        $set: 'WAITING',
                    },
                },
            });
        case AUTH_GET_STATUS_SUCCESS:
            return update(state, {
                validate: {
                    statusMessage: {
                        $set: 'SUCCESS',
                    },
                },
            });
        case AUTH_GET_STATUS_FAILURE:
            return update(state, {
                validate: {
                    statusMessage: {
                        $set: 'FAILURE',
                    },
                },
            });
        case AUTH_LOGOUT:
            return update(state, {
                validate: {
                    statusMessage: {
                        $set: 'FAILURE',
                    },
                },
                login: {
                    statusMessage: {
                        $set: 'INIT',
                    },
                },
            });
        case API_GET_USER_SUCCESS:
            return update(state, {
                validate: {
                    statusMessage: {
                        $set: 'SUCCESS',
                    },
                },
                currentUser: {
                    $set: action.currentUser,
                },
            });
        case API_GET_USER_FAILURE:
            return update(state, {
                validate: {
                    statusMessage: {
                        $set: 'FAILURE',
                    },
                },
                currentUser: {
                    $set: {},
                },
            });
        default:
            return state;
    }
}
