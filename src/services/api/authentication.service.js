import { client } from '../http';
import { urlConstants } from '../constants';

const AUTHENTICATION = urlConstants.AUTHENTICATION;

export const login = (username, password) => (
    client.post(AUTHENTICATION.LOGIN_URL, { username, password })
);

export const publicLogin = publicId => (
    client.post(AUTHENTICATION.PUBLIC_LOGIN_URL, { publicId })
);

export const refershJwtRequest = refreshToken => (
    client.post(AUTHENTICATION.TOKEN_URL, { refreshToken })
);

export const getUser = userId => (
    client.get(`${AUTHENTICATION.API_USER_URL}/${userId}`)
);

export const activate = (activateToken, password) => (
    client.post(AUTHENTICATION.API_ACTIVATE_URL, { activateToken, password })
);

export const changePassword = (currentPassword, newPassword) => (
    client.post(`${AUTHENTICATION.API_CHANGE_PASSWORD}?currentPassword=${currentPassword}&newPassword=${newPassword}`)
);

export const resetPassword = (resetToken, password) => (
    client.post(`${AUTHENTICATION.API_RESET_PASSWORD}?resetToken=${resetToken}&password=${password}`)
);

export const sendResetPasswordLink = email => (
    client.post(`${AUTHENTICATION.API_SEND_RESET_PASSWORD_LINK}?email=${email}`)
);
