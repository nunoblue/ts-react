import {
    TENANT_DEVICES,
    TENANT_DEVICES_SUCCESS,
    TENANT_DEVICES_FAILURE,
    API_SAVE_DEVICE_SUCCESS,
    API_DELETE_DEVICE_SUCCESS,
    API_DEVICE_TYPES,
    API_DEVICE_CREDENTIALS,
    API_ASSIGN_DEVICE_TO_CUSTOMER_SUCCESS,
    API_UNASSIGN_DEVICE_TO_CUSTOMER_SUCCESS,
    API_MAKE_DEVICE_PUBLIC_SUCCESS,
    CLEAR_DEVICES,
} from './DevicesTypes';
import { deviceService } from '../../services/api';

const getDevices = () => {
    return {
        type: TENANT_DEVICES,
    };
};

const getDeviceTypes = (data) => {
    return {
        type: API_DEVICE_TYPES,
        types: data,
    };
};

const getDevicesSuccess = (data) => {
    return {
        type: TENANT_DEVICES_SUCCESS,
        data,
    };
};

const getDevicesFailure = (message) => {
    return {
        type: TENANT_DEVICES_FAILURE,
        errorMessage: message,
    };
};

const getDeviceCredentialsSuccess = (data) => {
    return {
        type: API_DEVICE_CREDENTIALS,
        credentials: data,
    };
};

const saveDeviceSuccess = () => {
    return {
        type: API_SAVE_DEVICE_SUCCESS,
    };
};

const deleteDeviceSuccess = () => {
    return {
        type: API_DELETE_DEVICE_SUCCESS,
    };
};

const assignDeviceToCustomerSuccess = () => {
    return {
        type: API_ASSIGN_DEVICE_TO_CUSTOMER_SUCCESS,
    };
};

const unassignDeviceToCustomerSuccess = () => {
    return {
        type: API_UNASSIGN_DEVICE_TO_CUSTOMER_SUCCESS,
    };
};

const makeDevicePublicSuccess = () => {
    return {
        type: API_MAKE_DEVICE_PUBLIC_SUCCESS,
    };
};

const clearDevicesSuccess = () => {
    return {
        type: CLEAR_DEVICES,
    };
};

export const getDevicesRequest = (limit, textSearch, authority, id) => (dispatch) => {
    dispatch(getDevices());
    if (authority === 'TENANT_ADMIN') {
        return deviceService.getTenantDevices(limit, textSearch).then((response) => {
            dispatch(getDevicesSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getDevicesFailure(error.message));
        });
    }
    return deviceService.getCustomerDevices(limit, textSearch, id).then((response) => {
        dispatch(getDevicesSuccess(response.data.data));
    }).catch((error) => {
        dispatch(getDevicesFailure(error.message));
    });
};

export const getDeviceTypesRequest = () => (dispatch) => {
    dispatch(getDevices());
    return deviceService.getDeviceTypes().then((response) => {
        dispatch(getDeviceTypes(response.data));
    }).catch((error) => {
        dispatch(getDevicesFailure(error.message));
    });
};

export const getDeviceCredentialsRequest = (id) => {
    return (dispatch) => {
        dispatch(getDevices());
        return deviceService.getDeviceCredentials(id).then((response) => {
            dispatch(getDeviceCredentialsSuccess(response.data));
            return response.data;
        }).catch((error) => {
            dispatch(getDevicesFailure(error.message));
        });
    };
};

export const saveDeviceCredentialsRequest = (data) => {
    return (dispatch) => {
        dispatch(getDevices());
        return deviceService.saveDeviceCredentials(data).then(() => {
            dispatch(saveDeviceSuccess());
        }).catch((error) => {
            dispatch(getDevicesFailure(error.message));
        });
    };
};

export const saveDeviceRequest = (data) => {
    return (dispatch) => {
        dispatch(getDevices());
        return deviceService.saveDevice(data).then(() => {
            dispatch(saveDeviceSuccess());
        }).catch((error) => {
            dispatch(getDevicesFailure(error.message));
        });
    };
};

export const deleteDeviceRequest = (id) => {
    return (dispatch) => {
        dispatch(getDevices());
        return deviceService.deleteDevice(id).then(() => {
            dispatch(deleteDeviceSuccess());
        }).catch((error) => {
            dispatch(getDevicesFailure(error.message));
        });
    };
};

export const multipleDeleteDeviceRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getDevices());
        return deviceService.multipleDeleteDevice(idArray).then(() => {
            dispatch(deleteDeviceSuccess());
        }).catch((error) => {
            dispatch(getDevicesFailure(error.message));
        });
    };
};

export const assignDeviceToCustomerRequest = (customerId, deviceId) => (dispatch) => {
    dispatch(getDevices());
    return deviceService.assignDeviceToCustomer(customerId, deviceId).then(() => {
        dispatch(assignDeviceToCustomerSuccess());
    }).catch((error) => {
        dispatch(getDevicesFailure(error.message));
    });
};

export const multipleAssignDeviceToCustomerRequest = (customerId, deviceIdArray) => (dispatch) => {
    dispatch(getDevices());
    return deviceService.multipleAssignDeviceToCustomer(customerId, deviceIdArray).then(() => {
        dispatch(assignDeviceToCustomerSuccess());
    }).catch((error) => {
        dispatch(getDevicesFailure(error.message));
    });
};

export const unassignDeviceToCustomerRequest = deviceId => (dispatch) => {
    dispatch(getDevices());
    return deviceService.unassignDeviceToCustomer(deviceId).then(() => {
        dispatch(unassignDeviceToCustomerSuccess());
    }).catch((error) => {
        dispatch(getDevicesFailure(error.message));
    });
};

export const makeDevicePublicRequest = deviceId => (dispatch) => {
    dispatch(getDevices());
    return deviceService.makeDevicePublic(deviceId).then(() => {
        dispatch(makeDevicePublicSuccess());
    }).catch((error) => {
        dispatch(getDevicesFailure(error.message));
    });
};

export const clearDevicesRequest = () => (dispatch) => {
    dispatch(clearDevicesSuccess());
};
