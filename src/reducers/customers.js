import update from 'react-addons-update';

import {
    API_CUSTOMERS,
    API_CUSTOMERS_SUCCESS,
    API_CUSTOMERS_FAILURE
} from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
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
            });

        default:
            return state;
    }
};

export default customers;
