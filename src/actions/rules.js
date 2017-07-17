import axios from 'axios';
import storage from 'store/storages/localStorage';

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
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const API_RULE_URL = `${apServer}/api/rule`;
const RULES_URL = `${apServer}/api/rules`;
const API_COMPONENTS_URL = `${apServer}/api/components/`;
const API_COMPONENT_URL = `${apServer}/api/component/`;

function getRules() {
    return {
        type: API_RULES,
    };
}

function getRulesSuccess(data) {
    return {
        type: API_RULES_SUCCESS,
        data,
    };
}

function getRulesFailure() {
    return {
        type: API_RULES_FAILURE,
    };
}

function clearRulesSuccess() {
    return {
        type: CLEAR_RULES,
    };
}

function saveRuleSuccess() {
    return {
        type: API_SAVE_RULE_SUCCESS,
    };
}

function saveRuleFailure(message) {
    return {
        type: API_SAVE_RULE_FAILURE,
        errorMessage: message,
    };
}

function deleteRuleSuccess() {
    return {
        type: API_DELETE_RULE_SUCCESS,
    };
}

function deleteRuleFailure(message) {
    return {
        type: API_DELETE_RULE_FAILURE,
        errorMessage: message,
    };
}

function getFilterComponentsSuccess(components) {
    return {
        type: API_FILTER_COMPONENTS_SUCCESS,
        components,
    };
}
function getProcessorComponentsSuccess(components) {
    return {
        type: API_PROCESSOR_COMPONENTS_SUCCESS,
        components,
    };
}
function getPluginComponentsSuccess(components) {
    return {
        type: API_PLUGIN_COMPONENTS_SUCCESS,
        components,
    };
}
function getFilterComponentSuccess(component) {
    return {
        type: API_FILTER_COMPONENT_SUCCESS,
        component,
    };
}
function getProcessorComponentSuccess(component) {
    return {
        type: API_PROCESSOR_COMPONENT_SUCCESS,
        component,
    };
}
function getPluginComponentSuccess(component) {
    return {
        type: API_PLUGIN_COMPONENT_SUCCESS,
        component,
    };
}
function getActionComponentSuccess(component) {
    return {
        type: API_ACTION_COMPONENT_SUCCESS,
        component,
    };
}
function getComponentsFailure(message) {
    return {
        type: API_COMPONENTS_FAILURE,
        errorMessage: message,
    };
}
function getRuleActivateSuccess() {
    return {
        type: API_RULE_ACTIVATE_SUCCESS,
    };
}
function getRuleActivateFailure(message) {
    return {
        type: API_RULE_ACTIVATE_FAILURE,
        errorMessage: message,
    };
}

export const getRulesRequest = () => (dispatch) => {
    dispatch(getRules());

    return axios.get(RULES_URL, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getRulesSuccess(response.data));
    }).catch((error) => {
        console.error(JSON.stringify(error.response.data));
        dispatch(getRulesFailure());
    });
};

export const clearRulesRequest = () => (dispatch) => {
    dispatch(clearRulesSuccess());
};

export const saveRuleRequest = rule => (dispatch) => {
    dispatch(getRules());

    return axios.post(API_RULE_URL, rule, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(saveRuleSuccess());
    }).catch((error) => {
        dispatch(saveRuleFailure(error.response.data.message));
    });
};

export const deleteRulesRequest = idArray => (dispatch) => {
    dispatch(getRules());
    return axios.all(idArray.map(id => axios.delete(
            `${API_RULE_URL}/${id}`, {
                headers: {
                    'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
                },
            }).then((response) => {
                dispatch(deleteRuleSuccess());
            }).catch((error) => {
                dispatch(deleteRuleFailure(error.response.data.message));
            })));
};

export const getComponentsRequest = componentType => (dispatch) => {
    dispatch(getRules());
    const url = API_COMPONENTS_URL + componentType;
    return axios.get(url, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        switch ( componentType ) {
            case 'FILTER':
                dispatch(getFilterComponentsSuccess(response.data));
                break;
            case 'PROCESSOR':
                dispatch(getProcessorComponentsSuccess(response.data));
                break;
            case 'PLUGIN':
                dispatch(getPluginComponentsSuccess(response.data));
                break;
            default:
                break;
        }

    }).catch((error) => {
        dispatch(getComponentsFailure(error.response.data.message));
    });
}

export const getComponentRequest = clazz => (dispatch) => {
    dispatch(getRules());
    const url = API_COMPONENT_URL + clazz;
    return axios.get(url, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        const componentType = response.data.type;
        switch (componentType) {
            case 'FILTER':
                dispatch(getFilterComponentSuccess(response.data));
                break;
            case 'PROCESSOR':
                dispatch(getProcessorComponentSuccess(response.data));
                break;
            case 'PLUGIN':
                dispatch(getPluginComponentSuccess(response.data));
                break;
            case 'ACTION':
                dispatch(getActionComponentSuccess(response.data));
                break;
            default:
                break;
        }

    }).catch((error) => {
        dispatch(getComponentsFailure(error.response.data.message));
    });
};

export const activateRuleRequest = (id, state) => (dispatch) => {
    dispatch(getRules());

    const url = `${API_RULE_URL}/${id}/${state === 'ACTIVE' ? 'suspend' : 'activate'}`;
    return axios.post(url, null, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getRuleActivateSuccess());
    }).catch((error) => {
        console.log('ERROR', error);
        dispatch(getRuleActivateFailure(error));
    });
};