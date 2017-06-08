import {  
    API_RULES,
    API_RULES_SUCCESS,
    API_RULES_FAILURE
} from './ActionTypes';

import axios from 'axios';
import storage from 'store/storages/localStorage';

export const getRulesRequest = () =>  {
    return (dispatch) => {
        dispatch(getRules());

        return axios.get('http://localhost:8080/api/rules', {
            headers: {
                'X-Authorization': 'Bearer ' + storage.read('jwt_token')
            }
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
