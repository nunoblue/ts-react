import {
    API_CUSTOMERS,
    API_CUSTOMERS_SUCCESS,
    API_CUSTOMERS_FAILURE,
    API_SAVE_CUSTOMER_SUCCESS,
    API_DELETE_CUSTOMER_SUCCESS,
    API_CUSTOMERS_SHORT_INFO_SUCCESS,
    CLEAR_CUSTOMERS,
} from './CustomersTypes';
import { customerService } from '../../services/api';

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

function getShortInfoSuccess(data) {
    const temp = {};
    data.map((obj) => {
        const title = obj.data.title;
        const isPublic = obj.data.isPublic;
        const id = obj.config.headers.id;
        Object.assign(temp, { [id]: { title, isPublic } });
    });
    return {
        type: API_CUSTOMERS_SHORT_INFO_SUCCESS,
        shortInfo: temp,
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

function clearCustomersSuccess() {
    return {
        type: CLEAR_CUSTOMERS,
    };
}

export const getCustomersRequest = (limit, textSearch) => {
    return (dispatch) => {
        dispatch(getCustomers());
        if (typeof limit === 'undefined') {
            limit = 10;
        }
        return customerService.getCustomers(limit, textSearch).then((response) => {
            dispatch(getCustomersSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getCustomersFailure(error.message));
        });
    };
};

export const getCustomerShortInfoRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getCustomers());
        return customerService.getCustomerShortInfo(idArray).then((results) => {
            dispatch(getShortInfoSuccess(results, idArray));
        }).catch((error) => {
            dispatch(getCustomersFailure(error.message));
        });
    };
};

export const saveCustomerRequest = (data) => {
    return (dispatch) => {
        dispatch(getCustomers());
        return customerService.saveCustomer(data).then(() => {
            dispatch(saveCustomerSuccess());
        }).catch((error) => {
            dispatch(getCustomersFailure(error.message));
        });
    };
};

export const deleteCustomerRequest = (id) => {
    return (dispatch) => {
        dispatch(getCustomers());

        return customerService.deleteCustomer(id).then(() => {
            dispatch(deleteCustomerSuccess());
        }).catch((error) => {
            dispatch(getCustomersFailure(error.message));
        });
    };
};

export const multipleDeleteCustomerRequest = (idArray) => {
    return (dispatch) => {
        dispatch(getCustomers());
        return customerService.multipleDeleteCustomer(idArray).then(() => {
            dispatch(deleteCustomerSuccess());
        }).catch((error) => {
            dispatch(getCustomersFailure(error.message));
        });
    };
};

export const clearCustomersRequest = () => (dispatch) => {
    dispatch(clearCustomersSuccess());
};
