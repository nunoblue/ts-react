import { client } from '../http';
import { urlConstants } from '../constants';

const ADMINS = urlConstants.ADMINS;

export const getAdminSettingsMail = () => (
    client.get(ADMINS.API_ADMIN_SETTINGS_MAIL_URL)
);

export const getAdminSettingsGeneral = () => (
    client.get(ADMINS.API_ADMIN_SETTINGS_GENERAL_URL)
);

export const saveAdminSettings = data => (
    client.post(ADMINS.API_ADMIN_SETTINGS_SAVE_URL, data)
);
