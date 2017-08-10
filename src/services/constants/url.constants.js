/**
 * ADMIN API
 */
export const ADMINS = {
    API_ADMIN_SETTINGS_GENERAL_URL: '/api/admin/settings/general',
    API_ADMIN_SETTINGS_MAIL_URL: '/api/admin/settings/mail',
    API_ADMIN_SETTINGS_SAVE_URL: '/api/admin/settings',
};

/**
 * AUTHENTICATION API
 */
export const AUTHENTICATION = {
    LOGIN_URL: '/api/auth/login',
    PUBLIC_LOGIN_URL: '/api/auth/login/public',
    TOKEN_URL: '/api/auth/token',
    API_USER_URL: '/api/user',
    API_ACTIVATE_URL: '/api/noauth/activate',
    API_CHANGE_PASSWORD: '/api/auth/changePassword',
    API_RESET_PASSWORD: '/api/noauth/resetPassword',
    API_SEND_RESET_PASSWORD_LINK: '/api/noauth/resetPasswordByEmail',
};

/**
 * PLUGINS API
 */
export const PLUGINS = {
    API_PLUGIN_URL: '/api/plugin',
    API_PLUGINS_URL: '/api/plugins',
};

/**
 * RULES API
 */
export const RULES = {
    API_RULE_URL: '/api/rule',
    RULES_URL: '/api/rules',
    API_COMPONENTS_URL: '/api/components',
    API_COMPONENT_URL: '/api/component',
};

/**
 * CUSTOMERS API
 */
export const CUSTOMERS = {
    CUSTOMERS_URL: '/api/customers',
    SAVE_CUSTOMER_URL: '/api/customer',
    DELETE_CUSTOMER_URL: '/api/customer',
    SHORT_INFO_URL: '/api/customer',
};

/**
 * USERS API
 */
export const USERS = {
    USERS_URL: '/api/customer',
    SAVE_USER_URL: '/api/user',
    API_SEND_ACTIVATION_MAIL_URL: '/api/user/sendActivationMail',
    API_ACTIVATION_LINK_USER_URL: '/api/user',
    DELETE_USER_URL: '/api/user',
};

/**
 * DASHBOARDS API
 */
export const DASHBOARDS = {
    TENANT_DASHBOARDS_URL: '/api/tenant/dashboards',
    TENANT_DASHBOARDS_BY_ID_URL: '/api/tenant',
    GET_DASHBOARD_URL: '/api/dashboard',
    GET_DASHBOARD_INFO_URL: '/api/dashboard/info',
    CUSTOMER_DASHBOARDS_URL: '/api/customer',
    SAVE_DASHBOARD_URL: '/api/dashboard',
    DELETE_DASHBOARD_URL: '/api/dashboard',
    SERVERTIME_DASHBOARD_URL: '/api/dashboard/serverTime',
    ASSIGN_DASHBOARD_CUSTOMER_URL: '/api/customer',
    UNASSIGN_DASHBOARD_CUSTOMER_URL: 'api/customer/dashboard',
    MAKE_DASHBOARD_PUBLIC_URL: '/api/customer/public/dashboard/',
};

/**
 * WIDGETS API
 */
export const WIDGETS = {
    WIDGETS_URL: '/api/widgetsBundles',
};

/**
 * DEVICES API
 */
export const DEVICES = {
    TENANT_DEVICES_URL: '/api/tenant/devices',
    CUSTOMER_DEVICES_URL: '/api/customer',
    DEVICE_TYPES_URL: '/api/device/types',
    DEVICE_CREDENTIALS_URL: '/api/device',
    SAVE_CREDENTIALS_URL: '/api/device/credentials',
    GET_DEVICE_URL: '/api/device',
    GET_DEVICES_URL: '/api/devices',
    SAVE_DEVICE_URL: '/api/device',
    DELETE_DEVICE_URL: '/api/device',
    MAKE_DEVICE_PUBLIC_URL: '/api/customer/public/device',
};

/**
 * TELEMETRY API
 */
export const TELEMETRY = {
    API_ATTRIBUTES_URL: '/api/plugins/telemetry',
};
