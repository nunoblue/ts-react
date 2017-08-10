import { client } from '../http';
import { urlConstants } from '../constants';

const DEVICES = urlConstants.DEVICES;

export const getTenantDevices = (limit, textSearch) => (
    client.get(DEVICES.TENANT_DEVICES_URL, { limit, textSearch })
);

export const getAllTextSerachTenantDevices = (limit, textSearchArray) => (
    client.all(textSearchArray.map(textSearch => (
        getTenantDevices(limit, textSearch)
    )))
);

export const getCustomerDevices = (limit, textSearch, id) => (
    client.get(`${DEVICES.CUSTOMER_DEVICES_URL}/${id}/devices`, { limit, textSearch })
);

export const getDevice = (deviceId, ignoreErrors) => (
    client.get(`${DEVICES.GET_DEVICE_URL}/${deviceId}`, { ignoreErrors })
);

export const getDevices = deviceIds => (
    client.get(`${DEVICES.GET_DEVICES_URL}`, { deviceIds })
);

export const getDeviceTypes = () => (
    client.get(DEVICES.DEVICE_TYPES_URL)
);

export const getDeviceCredentials = id => (
    client.get(`${DEVICES.DEVICE_CREDENTIALS_URL}/${id}/credentials`)
);

export const saveDeviceCredentials = data => (
    client.post(DEVICES.SAVE_CREDENTIALS_URL, data)
);

export const saveDevice = data => (
    client.post(DEVICES.SAVE_DEVICE_URL, data)
);

export const deleteDevice = id => (
    client.delete(`${DEVICES.DELETE_DEVICE_URL}/${id}`)
);

export const multipleDeleteDevice = idArray => (
    client.all(idArray.map(id => (
        deleteDevice(id)
    )))
);

export const assignDeviceToCustomer = (customerId, deviceId) => (
    client.post(`${DEVICES.CUSTOMER_DEVICES_URL}/${customerId}/device/${deviceId}`)
);

export const multipleAssignDeviceToCustomer = (customerId, deviceIdArray) => (
    client.all(deviceIdArray.map(id => (
        assignDeviceToCustomer(id)
    )))
);

export const unassignDeviceToCustomer = deviceId => (
    client.delete(`${DEVICES.CUSTOMER_DEVICES_URL}/device/${deviceId}`)
);

export const makeDevicePublic = deviceId => (
    client.post(`${DEVICES.MAKE_DEVICE_PUBLIC_URL}/${deviceId}`)
);
