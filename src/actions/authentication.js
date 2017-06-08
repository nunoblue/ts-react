import axios from 'axios';
import storage from 'store/storages/localStorage';
import jwtDecode from 'jwt-decode';

import {
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT,
} from './ActionTypes';

import config from '../config';

/*= ===========================================================================
    authentication
==============================================================================*/

const apServer = config.apServer;
const LOGIN_URL = `${apServer}/api/auth/login`;
const TOKEN_URL = `${apServer}/api/auth/token`;

/* LOGIN */
export function loginRequest(username, password) {
    return (dispatch) => {
        dispatch(login());
        const loginData = {
            username,
            password,
        };
        return axios.post(LOGIN_URL, JSON.stringify(loginData), {
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        }).then((response) => {
            dispatch(loginSuccess(username, response));
        }).catch((error) => {
            // const $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
            // Materialize.toast($toastContent, 2000);
            dispatch(loginFailure());
        });
    };
}

export function login() {
    return {
        type: AUTH_LOGIN,
    };
}

export function loginSuccess(username, response) {
    const token = response.data.token;
    const refreshToken = response.data.refreshToken;
    setUserFromJwtToken(token, refreshToken, false, false);
    return {
        type: AUTH_LOGIN_SUCCESS,
        username,
    };
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE,
    };
}

/* REGISTER */
export function registerRequest(username, password) {
    return (dispatch) => {
        dispatch(register());

        return axios.post('/api/account/signup', { username, password })
        .then((response) => {
            dispatch(registerSuccess());
        }).catch((error) => {
            dispatch(registerFailure(error.response.data.code));
        });
    };
}

export function register() {
    return {
        type: AUTH_REGISTER,
    };
}

export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS,
    };
}

export function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error,
    };
}

/* GET STATUS */
export function refreshJwtRequest() {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            const refreshToken = storage.read('refresh_token');
            const refreshTokenValid = isTokenValid('refresh_token');
            if (!refreshTokenValid) {
                dispatch(getRefreshFailure());
                reject('refresh error');
            } else {
                const refreshTokenRequest = {
                    refreshToken,
                };
                axios.post(TOKEN_URL, JSON.stringify(refreshTokenRequest), {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                }).then((response) => {
                    dispatch(getRefreshSuccess(response));
                    resolve(response.status);
                }).catch((error) => {
                    dispatch(getRefreshFailure());
                    reject(error);
                });
            }
        });
    };
}

export function validateJwtToken(doRefresh) {
    return dispatch => new Promise((resolve, reject) => {
        if (!isTokenValid('jwt_token')) {
            if (doRefresh) {
                resolve('request refresh');
            } else {
                clearJwtToken(false);
                reject('reject refresh');
            }
        } else {
            dispatch(getRefreshSuccess());
        }
    });
}

export function getRefresh() {
    return {
        type: AUTH_GET_STATUS,
    };
}

export function getRefreshSuccess(response) {
    if (response) {
        const token = response.data.token;
        const refreshToken = response.data.refreshToken;
        setUserFromJwtToken(token, refreshToken, false, false);
    }

    return {
        type: AUTH_GET_STATUS_SUCCESS,
    };
}

export function getRefreshFailure() {
    clearJwtToken(false);
    return {
        type: AUTH_GET_STATUS_FAILURE,
    };
}

export function logoutRequest() {
    return (dispatch) => {
        dispatch(getRefreshFailure());
    };
}

export function logout() {
    clearJwtToken(true);
    return {
        type: AUTH_LOGOUT,
    };
}

function clearTokenData() {
    storage.remove('jwt_token');
    storage.remove('jwt_token_expiration');
    storage.remove('refresh_token');
    storage.remove('refresh_token_expiration');
}

function clearJwtToken(doLogout) {
    setUserFromJwtToken(null, null, true, doLogout);
}

function setUserFromJwtToken(jwtToken, refreshToken, notify, doLogout) {
    if (!jwtToken) {
        clearTokenData();
    } else {
        updateAndValidateToken(jwtToken, 'jwt_token', doLogout);
        updateAndValidateToken(refreshToken, 'refresh_token', doLogout);
    }
}

function updateAndValidateToken(token, prefix, notify) {
    let valid = false;
    const tokenData = jwtDecode(token);
    const issuedAt = tokenData.iat;
    const expTime = tokenData.exp;
    if (issuedAt && expTime) {
        const ttl = expTime - issuedAt;
        if (ttl > 0) {
            const clientExpiration = +new Date() + ttl * 1000;
            storage.write(prefix, token);
            storage.write(`${prefix}_expiration`, clientExpiration);
            valid = true;
        }
    }
}

export function isJwtTokenValid() {
    return isTokenValid('jwt_token');
}

function isTokenValid(prefix) {
    const clientExpiration = storage.read(`${prefix}_expiration`);
    return clientExpiration && clientExpiration > +new Date();
}

function isAuthenticated() {
    return storage.read('jwt_token');
}

function getJwtToken() {
    return storage.read('jwt_token');
}

function updateAuthorizationHeader(headers) {
    const jwtToken = storage.read('jwt_token');
    if (jwtToken) {
        headers['X-Authorization'] = `Bearer ${jwtToken}`;
    }
    return jwtToken;
}
