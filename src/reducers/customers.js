import update from 'react-addons-update';

import {
    API_CUSTOMERS,
    API_CUSTOMERS_SUCCESS,
    API_CUSTOMERS_FAILURE,
    API_SAVE_CUSTOMER_SUCCESS,
    API_DELETE_CUSTOMER_SUCCESS,
} from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    erorrMessage: 'NONE',
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

        default:
            return state;
    }
};

export default customers;
