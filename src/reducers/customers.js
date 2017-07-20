import update from 'react-addons-update';

import {
    API_CUSTOMERS,
    API_CUSTOMERS_SUCCESS,
    API_CUSTOMERS_FAILURE,
    API_SAVE_CUSTOMER_SUCCESS,
    API_DELETE_CUSTOMER_SUCCESS,
    API_CUSTOMERS_SHORT_INFO_SUCCESS,
    CLEAR_CUSTOMERS,
} from '../actions/customer/CustomersTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    erorrMessage: 'NONE',
    shortInfo: {},
};

const customers = (state = initialState, action) => {
    switch (action.type) {
        case API_CUSTOMERS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });

        case API_CUSTOMERS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data,
                },
            });

        case API_CUSTOMERS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_SAVE_CUSTOMER_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_DELETE_CUSTOMER_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_CUSTOMERS_SHORT_INFO_SUCCESS:
            return update(state, {
                shortInfo: {
                    $merge: action.shortInfo,
                },
            });
        case CLEAR_CUSTOMERS:
            return initialState;
        default:
            return state;
    }
};

export default customers;
