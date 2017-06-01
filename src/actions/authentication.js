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
    AUTH_LOGOUT
    
} from './ActionTypes';

import axios from 'axios';
import storage from 'store/storages/localStorage';
import jwtDecode from 'jwt-decode';

/*============================================================================
    authentication
==============================================================================*/

/* LOGIN */
export function loginRequest(username, password) {
    return (dispatch) => {
        dispatch(login());
        let loginData = {
            username: username,
            password: password
        }
        return axios.post('http://localhost:8080/api/auth/login', JSON.stringify(loginData), {
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
        }).then((response) => {
            dispatch(loginSuccess(username, response));
        }).catch((error) => {
            dispatch(loginFailure());
        });
    };
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}

export function loginSuccess(username, response) {
    let token = response.data.token;
    let refreshToken = response.data.refreshToken;
    setUserFromJwtToken(token, refreshToken, false, false);

    return {
        type: AUTH_LOGIN_SUCCESS,
        username
    };
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

/* REGISTER */
export function registerRequest(username, password) {
    return (dispatch) => {
        // Inform Register API is starting
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
        type: AUTH_REGISTER
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
        error
    };
}

/* GET STATUS */
export function refreshJwtRequest() {
    return (dispatch) => {
        dispatch(getRefresh());
        return new Promise((resolve, reject) => {
            let refreshToken = storage.read('refresh_token');
            let refreshTokenValid = isTokenValid('refresh_token');
            if(!refreshTokenValid) {
                dispatch(getRefreshFailure());
                reject('refresh error');
            } else {
                let refreshTokenRequest = {
                    refreshToken: refreshToken
                }
                axios.post('http://localhost:8080/api/auth/token', JSON.stringify(refreshTokenRequest), {
                    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
                }).then((response) => {
                    dispatch(getRefreshSuccess(response));
                    resolve(response.status);
                }).catch((error) => {
                    dispatch(getRefreshFailure());
                    reject(error);
                })
            }
        })
    }
}

export function validateJwtToken(doRefresh) {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if(!isJwtTokenValid()) {
                if(doRefresh) {
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
}

export function getRefresh() {
    return {
        type: AUTH_GET_STATUS
    };
}

export function getRefreshSuccess(response) {
    if(response) {
        let token = response.data.token;
        let refreshToken = response.data.refreshToken;
        setUserFromJwtToken(token, refreshToken, false, false);
    }

    return {
        type: AUTH_GET_STATUS_SUCCESS
    };
}

export function getRefreshFailure() {
    clearJwtToken(false);
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}

export function logoutRequest() {
    return (dispatch) => {
        dispatch(logout());
    };
}

export function logout() {
    clearJwtToken(true);
    return {
        type: AUTH_LOGOUT
    }
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
    if(!jwtToken) {
        clearTokenData();
    } else {
        updateAndValidateToken(jwtToken, 'jwt_token', doLogout);
        updateAndValidateToken(refreshToken, 'refresh_token', doLogout);
    }
}

function updateAndValidateToken(token, prefix, notify) {
    let valid = false;
    let tokenData = jwtDecode(token);
    let issuedAt = tokenData.iat;
    let expTime = tokenData.exp;
    if(issuedAt && expTime) {
        let ttl = expTime - issuedAt;
        if(ttl > 0) {
            let clientExpiration = +new Date() + ttl*10;
            storage.write(prefix, token);
            storage.write(prefix+'_expiration', clientExpiration);
            valid = true;
        }
    }
}

function isJwtTokenValid() {
    return isTokenValid('jwt_token');
}

function isTokenValid(prefix) {
    let clientExpiration = storage.read(prefix + '_expiration');
    return clientExpiration && clientExpiration > +new Date();
}

function isAuthenticated() {
    return storage.read('jwt_token');
}

function getJwtToken() {
    return storage.read('jwt_token');
}

function updateAuthorizationHeader(headers) {
    let jwtToken = storage.read('jwt_token');
    if(jwtToken) {
        headers['X-Authorization'] = 'Bearer ' + jwtToken;
    }
    return jwtToken;
}