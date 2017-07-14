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
    API_FILTER_COMPONENTS_SUCCESS,
    API_PROCESSOR_COMPONENTS_SUCCESS,
    API_PLUGIN_COMPONENTS_SUCCESS,
    API_FILTER_COMPONENT_SUCCESS,
    API_PROCESSOR_COMPONENT_SUCCESS,
    API_PLUGIN_COMPONENT_SUCCESS,
    API_ACTION_COMPONENT_SUCCESS,
    API_COMPONENTS_FAILURE,
    API_RULE_ACTIVATE_SUCCESS,
    API_RULE_ACTIVATE_FAILURE,
} from '../actions/ActionTypes';

const initialState = {
    statusMessage: 'INIT',
    data: [],
    errorMessage: 'NONE',
    filterComponents: [],
    processorComponents: [],
    pluginComponents: [],
    filterComponent: {},
    processorComponent: {},
    pluginComponent: {},
    actionComponent: {},
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
        case API_FILTER_COMPONENTS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                filterComponents: {
                    $set: action.components,
                },
            });
        case API_PROCESSOR_COMPONENTS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                processorComponents: {
                    $set: action.components,
                },
            });
        case API_PLUGIN_COMPONENTS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                pluginComponents: {
                    $set: action.components,
                },
            });
        case API_FILTER_COMPONENT_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                filterComponent: {
                    $set: action.component,
                },
            });
        case API_PROCESSOR_COMPONENT_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                processorComponent: {
                    $set: action.component,
                },
            });
        case API_PLUGIN_COMPONENT_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                pluginComponent: {
                    $set: action.component,
                },
            });
        case API_ACTION_COMPONENT_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                actionComponent: {
                    $set: action.component,
                },
            });
        case API_COMPONENTS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case API_RULE_ACTIVATE_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
            });
        case API_RULE_ACTIVATE_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        default:
            return state;
    }
}
