import axios from 'axios';
import storage from 'store/storages/localStorage';

import {
    API_CUSTOMERS,
    API_CUSTOMERS_SUCCESS,
    API_CUSTOMERS_FAILURE
    } from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const CUSTOMERS_URL = `${apServer}/api/customers`;

export const getCustomersRequest = (limit, textSearch) => {
    return (dispatch) => {
        dispatch(getCustomers());

        const params = {
            type: API_CUSTOMERS,
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
            console.error(error.message);
            dispatch(getCustomersFailure());
        });
    };
};

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

function getCustomersFailure() {
    return {
        type: API_CUSTOMERS_FAILURE,
    };
}
