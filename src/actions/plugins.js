import { 
    API_PLUGINS,
    API_PLUGINS_SUCCESS,
    API_PLUGINS_FAILURE
} from './ActionTypes';

import axios from 'axios';
import storage from 'store/storages/localStorage';
import jwtDecode from 'jwt-decode';

export const getPluginsRequest = () =>  {
    return (dispatch) => {
        dispatch(getPlugins());

        return axios.get('http://localhost:8080/api/plugins', {
            headers: {
                'X-Authorization': 'Bearer ' + storage.read('jwt_token')
            }
        }).then((response) => {
            dispatch(getPluginsSuccess(response.data));
        }).catch((error) => {
            dispatch(getPluginsFailure());
        })
    }
};

function getPlugins() {
    return {
        type: API_PLUGINS
    }
}

function getPluginsSuccess(data) {
    return {
        type: API_PLUGINS_SUCCESS,
        data: data
    }
}

function getPluginsFailure() {
    return {
        type: API_PLUGINS_FAILURE
    }
}
