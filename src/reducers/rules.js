import update from 'react-addons-update';

import {
    API_RULES,
    API_RULES_SUCCESS,
    API_RULES_FAILURE,
    CLEAR_RULES,
    API_SAVE_RULE_SUCCESS,
    API_SAVE_RULE_FAILURE,
    API_DELETE_RULE_SUCCESS,
    API_DELETE_RULE_FAILURE,
    API_COMPONENTS_SUCCESS,
    API_COMPONENTS_FAILURE,
} from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    errorMessage: 'NONE',
    components:[],
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
        case API_SAVE_RULE_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_SAVE_RULE_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_DELETE_RULE_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_DELETE_RULE_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_COMPONENTS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                components: {
                    $set: action.components,
                },
            });
        case API_COMPONENTS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        default:
            return state;
    }
}
