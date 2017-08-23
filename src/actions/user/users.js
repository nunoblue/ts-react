import {
    API_USERS,
    API_USERS_SUCCESS,
    API_USERS_FAILURE,
    API_SAVE_USERS_SUCCESS,
    API_DELETE_USERS_SUCCESS,
    CLEAR_USERS,
    API_SEND_ACTIVATION_SUCCESS,
} from './UsersTypes';
import { userService } from '../../services/api';

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

function clearUsersSuccess() {
    return {
        type: CLEAR_USERS,
    };
}

function sendActivationMailSuccess() {
    return {
        type: API_SEND_ACTIVATION_SUCCESS,
    };
}

export const getUsersRequest = (limit, textSearch, id) => {
    return (dispatch) => {
        dispatch(getUsers());
        return userService.getUsers(limit, textSearch, id).then((response) => {
            dispatch(getUsersSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getUsersFailure(error.message));
        });
    };
};

export const saveUserRequest = (data) => {
    return (dispatch) => {
        dispatch(getUsers());

        return userService.saveUser(data).then(() => {
            dispatch(saveUserSuccess());
        }).catch((error) => {
            dispatch(getUsersFailure(error.message));
        });
    };
};

export const deleteUserRequest = (id) => {
    return (dispatch) => {
        dispatch(getUsers());

        return userService.deleteUser(id).then(() => {
            dispatch(deleteUserSuccess());
        }).catch((error) => {
            dispatch(getUsersFailure(error.message));
        });
    };
};

export const multipleDeleteUserRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getUsers());
        return userService.multipleDeleteUser(idArray).then(() => {
            dispatch(deleteUserSuccess());
        }).catch((error) => {
            dispatch(getUsersFailure(error.message));
        });
    };
};

export const sendActivationMailRequest = (email) => {
    return (dispatch) => {
        dispatch(getUsers());
        return userService.sendActivationMail(email).then(() => {
            dispatch(sendActivationMailSuccess());
        }).catch((error) => {
            dispatch(getUsersFailure(error.message));
        });
    };
};

export const clearUsersRequest = () => (dispatch) => {
    dispatch(clearUsersSuccess());
};
