'use strict';

import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    login: {
        statusMessage: 'INIT'
    },
    register: {
        statusMessage: 'INIT',
        error: -1
    },
    validate: {
        statusMessage: 'INIT'
    },
    status: {
        validate: false,
        isLoggedIn: false,
        currentUser: '',
    }
};

export default function authentication(state = initialState, action) {
    switch(action.type) {
        /* LOGIN */
        case types.AUTH_LOGIN:
            return update(state, {
                login: {
                    statusMessage: { $set: 'WAITING' }
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    statusMessage: { $set: 'SUCCESS' }
                },
                validate: {
                    statusMessage: { $set: 'SUCCESS' }
                },
                status: {
                    validate: { $set: true },
                    isLoggedIn: { $set: true },
                    currentUser: { $set: action.username },
                }
            });
        case types.AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    statusMessage: { $set: 'FAILURE' }
                }
            });
        case types.AUTH_REGISTER:
            return update(state, {
                register: {
                    statusMessage: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.AUTH_REGISTER_SUCCESS:
            return update(state, {
                register: {
                    statusMessage: { $set: 'SUCCESS' }
                }
            });
        case types.AUTH_REGISTER_FAILURE:
            return update(state, {
                register: {
                    statusMessage: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.AUTH_GET_STATUS:
            return update(state, {
                validate: {
                    statusMessage: { $set: 'WAITING' }
                }
            });
        case types.AUTH_GET_STATUS_SUCCESS:
            return update(state, {
                validate: {
                    statusMessage: { $set: 'SUCCESS' }
                },
                status: {
                    validate: { $set: true },
                    isLoggedIn: { $set: true }
                }
            });
        case types.AUTH_GET_STATUS_FAILURE:
            return update(state, {
                validate: {
                    statusMessage: { $set: 'FAILURE' }
                },
                status: {
                    validate: { $set: false },
                    isLoggedIn: { $set: false }
                }
            });
        case types.AUTH_LOGOUT:
            return update(state, {
                status: {
                    validate: { $set: false },
                    isLoggedIn: { $set: false },
                    currentUser: { $set: '' }
                }
            });
        default:
            return state;
    }
}