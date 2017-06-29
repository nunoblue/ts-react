import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    API_USERS,
    API_USERS_SUCCESS,
    API_USERS_FAILURE,
    API_SAVE_USERS_SUCCESS,
    API_DELETE_USERS_SUCCESS,
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const USERS_URL = `${apServer}/api/customer/`;
const SAVE_USER_URL = `${apServer}/api/user`;
const DELETE_USER_URL = `${apServer}/api/user`;

function getUsers() {
    return {
        type: API_USERS,
    };
}

function getUsersSuccess(data) {
    return {
        type: API_USERS_SUCCESS,
        data,
    };
}

function getUsersFailure(message) {
    return {
        type: API_USERS_FAILURE,
        errorMessage: message,
    };
}

function saveUserSuccess() {
    return {
        type: API_SAVE_USERS_SUCCESS,
    };
}

function deleteUserSuccess() {
    return {
        type: API_DELETE_USERS_SUCCESS,
    };
}

export const getUsersRequest = (limit, textSearch, id) => {
    return (dispatch) => {
        dispatch(getUsers());

        const params = {
            limit,
            textSearch,
        };
        return axios.get(`${USERS_URL}/${id}/users`, {
            params,
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(getUsersSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getUsersFailure(error.response.data.message));
        });
    };
};

export const saveUserRequest = (data) => {
    return (dispatch) => {
        dispatch(getUsers());

        return axios.post(SAVE_USER_URL, data, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(saveUserSuccess());
        }).catch((error) => {
            dispatch(getUsersFailure(error.response.data.message));
        });
    };
};

export const deleteUserRequest = (id) => {
    return (dispatch) => {
        dispatch(getUsers());

        return axios.delete(`${DELETE_USER_URL}/${id}`, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(deleteUserSuccess());
        }).catch((error) => {
            dispatch(getUsersFailure(error.response.data.message));
        });
    };
};

export const multipleDeleteUserRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getUsers());
        return axios.all(idArray.map((id) => {
            return axios.delete(`${DELETE_USER_URL}/${id}`, {
                headers: {
                    'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
                },
            }).then((response) => {
                dispatch(deleteUserSuccess());
            }).catch((error) => {
                dispatch(getUsersFailure(error.response.data.message));
            });
        }));
    };
};

