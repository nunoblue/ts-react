import update from 'react-addons-update';

import {
    API_RULES,
    API_RULES_SUCCESS,
    API_RULES_FAILURE,
    CLEAR_RULES,
} from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    errorMessage: 'NONE',
};

export default function rules(state = initialState, action) {
    switch (action.type) {
        case API_RULES:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });
        case API_RULES_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data,
                },
            });
        case API_RULES_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case CLEAR_RULES:
            return initialState;
        default:
            return state;
    }
}
