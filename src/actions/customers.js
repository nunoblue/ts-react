import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    API_CUSTOMERS,
    API_CUSTOMERS_SUCCESS,
    API_CUSTOMERS_FAILURE,
    API_SAVE_CUSTOMER_SUCCESS,
    API_DELETE_CUSTOMER_SUCCESS,
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const CUSTOMERS_URL = `${apServer}/api/customers`;
const SAVE_CUSTOMER_URL = `${apServer}/api/customer`;
const DELETE_CUSTOMER_URL = `${apServer}/api/customer`;

function getCustomers() {
    return {
        type: API_CUSTOMERS,
    };
}

function getCustomersSuccess(data) {
    return {
        type: API_CUSTOMERS_SUCCESS,
        data,
    };
}

function getCustomersFailure(message) {
    return {
        type: API_CUSTOMERS_FAILURE,
        errorMessage: message,
    };
}

function saveCustomerSuccess() {
    return {
        type: API_SAVE_CUSTOMER_SUCCESS,
    };
}

function deleteCustomerSuccess() {
    return {
        type: API_DELETE_CUSTOMER_SUCCESS,
    };
}

export const getCustomersRequest = (limit, textSearch) => {
    return (dispatch) => {
        dispatch(getCustomers());

        const params = {
            limit,
            textSearch,
        };

        return axios.get(CUSTOMERS_URL, {
            params,
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(getCustomersSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getCustomersFailure(error.response.data.message));
        });
    };
};

export const saveCustomerRequest = (data) => {
    return (dispatch) => {
        dispatch(getCustomers());

        return axios.post(SAVE_CUSTOMER_URL, data, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(saveCustomerSuccess());
        }).catch((error) => {
            dispatch(getCustomersFailure(error.response.data.message));
        });
    };
};

export const deleteCustomerRequest = (id) => {
    return (dispatch) => {
        dispatch(getCustomers());

        return axios.delete(`${DELETE_CUSTOMER_URL}/${id}`, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(deleteCustomerSuccess());
        }).catch((error) => {
            dispatch(getCustomersFailure(error.response.data.message));
        });
    };
};

export const multipleDeleteCustomerRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getCustomers());
        return axios.all(idArray.map((id) => {
            return axios.delete(`${DELETE_CUSTOMER_URL}/${id}`, {
                headers: {
                    'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
                },
            }).then((response) => {
                dispatch(deleteCustomerSuccess());
            }).catch((error) => {
                dispatch(getCustomersFailure(error.response.data.message));
            });
        }));
    };
};

