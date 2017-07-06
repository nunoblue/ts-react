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
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const API_RULE_URL = `${apServer}/api/rule`;
const RULES_URL = `${apServer}/api/rules`;

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

export const getRulesRequest = () => (dispatch) => {
    dispatch(getRules());

    return axios.get(RULES_URL, {
        headers: {
            'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
        },
    }).then((response) => {
        dispatch(getRulesSuccess(response.data));
    }).catch((error) => {
        console.log(JSON.stringify(error.response.data));
        dispatch(getRulesFailure());
    });
};

export const clearRulesRequest = () => (dispatch) => {
    dispatch(clearRulesSuccess());
};

export const saveRuleRequest = data => (dispatch) => {
    dispatch(getRules());

    const sample = {
        filters: [
            {
                configuration: {
                    methodNames: [
                        {
                            name: 'getTelemetry',
                        },
                    ],
                },
                name: 'filter1',
                clazz: 'org.thingsboard.server.extensions.core.filter.MethodNameFilter',
            },
        ],
        name: 'testRule',
        additionalInfo: {
            description: 'desc',
        },
        processor: {
            configuration: {
                alarmIdTemplate: '${date}',
                alarmBodyTemplate: '${date}${content}',
            },
            clazz: 'org.thingsboard.server.extensions.core.processor.AlarmDeduplicationProcessor',
            name: 'Alarm',
        },
        pluginToken: 'telemetry',
        action: {
            configuration: {},
            clazz: 'org.thingsboard.server.extensions.core.action.telemetry.TelemetryPluginAction',
            name: 'testAction',
        },
    };

    // Assemble rule object
    if (data.id) {
        sample.id = { id: data.id };
    }
    sample.name = data.name;
    sample.additionalInfo.description = data.description;
    return axios.post(API_RULE_URL, sample, {
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
