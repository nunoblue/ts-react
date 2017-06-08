import axios from 'axios';
import storage from 'store/storages/localStorage';

import {  
    API_RULES,
    API_RULES_SUCCESS,
    API_RULES_FAILURE
} from './ActionTypes';

import config from '../config';

const apServer = config.apServer;
const RULES_URL = `${apServer}/api/rules`;

export const getRulesRequest = () =>  {
    return (dispatch) => {
        dispatch(getRules());

        return axios.get(RULES_URL, {
            headers: {
                'X-Authorization': `Bearer ${storage.read('jwt_token')}`,
            },
        }).then((response) => {
            dispatch(getRulesSuccess(response.data));
        }).catch((error) => {
            dispatch(getRulesFailure());
        })
    }
};

function getRules() {
    return {
        type: API_RULES
    }
}

function getRulesSuccess(data) {
    return {
        type: API_RULES_SUCCESS,
        data: data
    }
}

function getRulesFailure() {
    return {
        type: API_RULES_FAILURE
    }
}
