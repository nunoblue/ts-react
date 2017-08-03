import { client } from '../http';
import { urlConstants } from '../constants';

const USERS = urlConstants.USERS;

export const getUsers = (limit, textSearch, id) => (
    client.get(`${USERS.USERS_URL}/${id}/users`, { limit, textSearch })
);

export const saveUser = data => (
    client.post(`${USERS.SAVE_USER_URL}`, data)
);

export const deleteUser = id => (
    client.get(`${USERS.DELETE_USER_URL}/${id}`)
);

export const multipleDeleteUser = idArray => (
    client.all(idArray.map(id => (
        deleteUser(id)
    )))
);

export const sendActivationMail = email => (
    client.post(`${USERS.API_SEND_ACTIVATION_MAIL_URL}?email=${email}`)
);

export const getActivationLink = userId => (
    client.post(`${USERS.API_ACTIVATION_LINK_USER_URL}/${userId}/activationLink`)
);
