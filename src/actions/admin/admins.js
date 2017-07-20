import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    API_ADMINS,
    API_ADMINS_FAILURE,
    API_ADMINS_SUCCESS,
    API_ADMIN_SETTINGS_SAVE,
} from './AdminsTypes';

import config from '../../config';

const apServer = config.apServer;
const API_ADMIN_SETTINGS_GENERAL_URL = `${apServer}/api/admin/settings/general`;
const API_ADMIN_SETTINGS_MAIL_URL = `${apServer}/api/admin/settings/mail`;
const API_ADMIN_SETTINGS_SAVE_URL = `${apServer}/api/admin/settings`;

function getAdminSettings() {
    return {
        type: API_ADMINS,
    };
}

function getAdminSettingsFailure(errorMessage) {
    return {
        type: API_ADMINS_FAILURE,
        errorMessage,
    };
}

function getAdminSettingsSusccess(data) {
    return {
        type: API_ADMINS_SUCCESS,
        data,
    };
}

function saveAdminSettings() {
    return {
        type: API_ADMIN_SETTINGS_SAVE,
    };
}

export const getAdminSettingsRequest = (key) => {
    return (dispatch) => {
        dispatch(getAdminSettings());
        let url;
        if (key === 'mail') {
            url = API_ADMIN_SETTINGS_MAIL_URL;
        } else {
            url = API_ADMIN_SETTINGS_GENERAL_URL;
        }
        return axios.get(url, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(getAdminSettingsSusccess(response.data));
        }).catch((error) => {
            dispatch(getAdminSettingsFailure(error.response.data.message));
        });
    };
};

export const saveAdminSettingsRequest = (data) => {
    return (dispatch) => {
        dispatch(getAdminSettings());

        return axios.post(API_ADMIN_SETTINGS_SAVE_URL, data, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(saveAdminSettings());
        }).catch((error) => {
            dispatch(getAdminSettingsFailure(error.response.data.message));
        });
    };
};
