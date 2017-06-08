import {  
    API_WIDGETS,
    API_WIDGETS_SUCCESS,
    API_WIDGETS_FAILURE
} from './ActionTypes';

import axios from 'axios';
import storage from 'store/storages/localStorage';

export const getWidgetsRequest = () =>  {
    return (dispatch) => {
        dispatch(getWidgets());

        return axios.get('http://localhost:8080/api/widgetsBundles', {
            headers: {
                'X-Authorization': 'Bearer ' + storage.read('jwt_token')
            }
        }).then((response) => {
            dispatch(getWidgetsSuccess(response.data));
        }).catch((error) => {
            dispatch(getWidgetsFailure());
        })
    }
};

function getWidgets() {
    return {
        type: API_WIDGETS
    }
}

function getWidgetsSuccess(data) {
    return {
        type: API_WIDGETS_SUCCESS,
        data: data
    }
}

function getWidgetsFailure() {
    return {
        type: API_WIDGETS_FAILURE
    }
}