import storage from 'store/storages/localStorage';
import jwtDecode from 'jwt-decode';

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
} from './AuthenticationTypes';
import { authenticationService } from '../../services/api';

const updateAndValidateToken = (token, prefix, notify) => {
    let valid = false;
    const tokenData = jwtDecode(token);
    const issuedAt = tokenData.iat;
    const expTime = tokenData.exp;
    if (issuedAt && expTime) {
        const ttl = expTime - issuedAt;
        if (ttl > 0) {
            const clientExpiration = +new Date() + (ttl * 1000);
            storage.write(prefix, token);
            storage.write(`${prefix}_expiration`, clientExpiration);
            valid = true;
        }
    }
};

const clearTokenData = () => {
    storage.remove('jwt_token');
    storage.remove('jwt_token_expiration');
    storage.remove('refresh_token');
    storage.remove('refresh_token_expiration');
};

const setUserFromJwtToken = (jwtToken, refreshToken, notify, doLogout) => {
    if (!jwtToken) {
        clearTokenData();
    } else {
        updateAndValidateToken(jwtToken, 'jwt_token', doLogout);
        updateAndValidateToken(refreshToken, 'refresh_token', doLogout);
    }
};

const clearJwtToken = (doLogout) => {
    setUserFromJwtToken(null, null, true, doLogout);
};

const isTokenValid = (prefix) => {
    const clientExpiration = storage.read(`${prefix}_expiration`);
    return clientExpiration && clientExpiration > +new Date();
};

const login = () => {
    return {
        type: AUTH_LOGIN,
    };
};

const loginSuccess = (data) => {
    const token = data.token;
    const refreshToken = data.refreshToken;
    setUserFromJwtToken(token, refreshToken, false, false);
    return {
        type: AUTH_LOGIN_SUCCESS,
    };
};

const loginFailure = (errorMessage) => {
    return {
        type: AUTH_LOGIN_FAILURE,
        errorMessage,
    };
};

const logoutSuccess = () => {
    clearJwtToken(false);
    return {
        type: AUTH_LOGOUT,
    };
};

const getUserSuccess = (data) => {
    return {
        type: API_GET_USER_SUCCESS,
        currentUser: data,
    };
};

const getUserFailure = (message) => {
    clearJwtToken(false);
    return {
        type: API_GET_USER_FAILURE,
        errorMessage: message,
    };
};

const getRefresh = () => {
    return {
        type: AUTH_GET_STATUS,
    };
};

const getRefreshSuccess = (data) => {
    if (data) {
        const token = data.token;
        const refreshToken = data.refreshToken;
        setUserFromJwtToken(token, refreshToken, false, false);
    }

    return {
        type: AUTH_GET_STATUS_SUCCESS,
    };
};

const getRefreshFailure = (message) => {
    clearJwtToken(false);
    return {
        type: AUTH_GET_STATUS_FAILURE,
        errorMessage: message,
    };
};

// const fetchAllowedDashboardIds = () => {
//     const pageLink = {limit: 100};
//     let fetchDashboardsPromise;
//     if (currentUser.authority === 'TENANT_ADMIN') {
//         fetchDashboardsPromise = dashboardService.getTenantDashboards(pageLink);
//     } else {
//         fetchDashboardsPromise = dashboardService.getCustomerDashboards(currentUser.customerId, pageLink);
//     }
//     fetchDashboardsPromise.then(
//         function success(result) {
//             var dashboards = result.data;
//             for (var d=0;d<dashboards.length;d++) {
//                 allowedDashboardIds.push(dashboards[d].id.id);
//             }
//             deferred.resolve();
//         },
//         function fail() {
//             deferred.reject();
//         }
//     );
// }

export const loginRequest = (username, password) => (dispatch) => {
    dispatch(login());
    return authenticationService.login(username, password).then((response) => {
        dispatch(loginSuccess(response.data));
    }).catch((error) => {
        dispatch(loginFailure(error.message));
    });
};

/* GET STATUS */
export const refreshJwtRequest = () => (dispatch) => {
    const refreshToken = storage.read('refresh_token');
    const refreshTokenValid = isTokenValid('refresh_token');
    dispatch(getRefresh());
    if (!refreshTokenValid) {
        return dispatch(getRefreshFailure());
    }
    return authenticationService.refershJwtRequest(refreshToken).then((response) => {
        dispatch(getRefreshSuccess(response.data));
    }).catch((error) => {
        dispatch(getRefreshFailure(error.message));
    });
};

export const validateJwtToken = (doRefresh) => {
    const promise = dispatch => new Promise((resolve, reject) => {
        dispatch(getRefresh());
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
    dispatch(logoutSuccess());
};

export const isJwtTokenValid = () => isTokenValid('jwt_token');

export const isRefreshTokenValid = () => isTokenValid('refresh_token');

export const getUserRequest = () => {
    return (dispatch) => {
        const token = storage.read('jwt_token');
        if (!token) {
            return;
        }
        const tokenData = jwtDecode(token);
        if (tokenData && tokenData.scopes && tokenData.scopes.length > 0) {
            tokenData.authority = tokenData.scopes[0];
        } else if (tokenData) {
            tokenData.authority = 'ANONYMOUS';
        }
        if (tokenData.isPublic) {
            // $rootScope.forceFullscreen = true;
            // fetchAllowedDashboardIds();
        } else if (tokenData.userId) {
            return authenticationService.getUser(tokenData.userId).then((response) => {
                dispatch(getUserSuccess(response.data));
            }).catch((error) => {
                dispatch(getUserFailure(error.message));
            });
        }
    };
};

export const activateRequest = (activateToken, password) => {
    return (dispatch) => {
        dispatch(login());
        return authenticationService.activate(activateToken, password).then((response) => {
            dispatch(loginSuccess(response.data));
        }).catch((error) => {
            dispatch(loginFailure(error.message));
        });
    };
};
