import {
    API_ADMINS,
    API_ADMINS_FAILURE,
    API_ADMINS_SUCCESS,
    API_ADMIN_SETTINGS_SAVE,
    CLEAR_ADMINS,
} from './AdminsTypes';
import { adminService } from '../../services/api';

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

const clearAdminsSuccess = () => {
    return {
        type: CLEAR_ADMINS,
    };
};

export const getAdminSettingsRequest = (key) => {
    return (dispatch) => {
        dispatch(getAdminSettings());
        let promise;
        if (key === 'mail') {
            promise = adminService.getAdminSettingsMail();
        } else {
            promise = adminService.getAdminSettingsGeneral();
        }
        return promise.then((response) => {
            dispatch(getAdminSettingsSusccess(response.data));
        }).catch((error) => {
            dispatch(getAdminSettingsFailure(error.message));
        });
    };
};

export const saveAdminSettingsRequest = (data) => {
    return (dispatch) => {
        dispatch(getAdminSettings());

        return adminService.saveAdminSettings(data).then(() => {
            dispatch(saveAdminSettings());
        }).catch((error) => {
            dispatch(getAdminSettingsFailure(error.message));
        });
    };
};

export const clearAdminsRequest = () => (dispatch) => {
    dispatch(clearAdminsSuccess());
};
