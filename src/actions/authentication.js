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

function clearTokenData() {
    storage.remove('jwt_token');
    storage.remove('jwt_token_expiration');
    storage.remove('refresh_token');
    storage.remove('refresh_token_expiration');
}
function setUserFromJwtToken(jwtToken, refreshToken, notify, doLogout) {
    if (!jwtToken) {
        clearTokenData();
    } else {
        updateAndValidateToken(jwtToken, 'jwt_token', doLogout);
        updateAndValidateToken(refreshToken, 'refresh_token', doLogout);
    }
}


function clearJwtToken(doLogout) {
    setUserFromJwtToken(null, null, true, doLogout);
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

/**
 * LOGIN
 */
function login() {
    return {
        type: AUTH_LOGIN,
    };
}

function loginSuccess(username, response) {
    const token = response.data.token;
    const refreshToken = response.data.refreshToken;
    setUserFromJwtToken(token, refreshToken, false, false);
    return {
        type: AUTH_LOGIN_SUCCESS,
        username,
    };
}

function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE,
    };
}

export const loginRequest = (username, password) => (dispatch) => {
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

function register() {
    return {
        type: AUTH_REGISTER,
    };
}

function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS,
    };
}

function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error,
    };
}

/* REGISTER */
export const registerRequest = (username, password) => (dispatch) => {
    dispatch(register());

    return axios.post('/api/account/signup', { username, password })
    .then((response) => {
        dispatch(registerSuccess(response));
    }).catch((error) => {
        dispatch(registerFailure(error.response.data.code));
    });
};

function getRefresh() {
    return {
        type: AUTH_GET_STATUS,
    };
}

function getRefreshSuccess(response) {
    if (response) {
        const token = response.data.token;
        const refreshToken = response.data.refreshToken;
        setUserFromJwtToken(token, refreshToken, false, false);
    }

    return {
        type: AUTH_GET_STATUS_SUCCESS,
    };
}

function getRefreshFailure() {
    clearJwtToken(false);
    return {
        type: AUTH_GET_STATUS_FAILURE,
    };
}

/* GET STATUS */
export const refreshJwtRequest = () => (dispatch) => {
    const refreshToken = storage.read('refresh_token');
    const refreshTokenValid = isTokenValid('refresh_token');

    dispatch(getRefresh());

    if (!refreshTokenValid) {
        return dispatch(getRefreshFailure());
    }
    const refreshTokenRequest = {
        refreshToken,
    };
    return axios.post(TOKEN_URL, JSON.stringify(refreshTokenRequest), {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    }).then((response) => {
        dispatch(getRefreshSuccess(response));
    }).catch((error) => {
        dispatch(getRefreshFailure());
    });
};

export const validateJwtToken = (doRefresh) => {
    const promise = dispatch => new Promise((resolve, reject) => {
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
    return promise;
};

export const logoutRequest = () => (dispatch) => {
    dispatch(getRefreshFailure());
};

export const isJwtTokenValid = () => isTokenValid('jwt_token');
