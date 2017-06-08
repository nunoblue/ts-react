import { 
    TENANT_DASHBOARDS,
    TENANT_DASHBOARDS_SUCCESS,
    TENANT_DASHBOARDS_FAILURE

 } from './ActionTypes';

import axios from 'axios';
import storage from 'store/storages/localStorage';
import jwtDecode from 'jwt-decode';

export const getDashboardsRequest = (limit, textSearch) =>  {
    return (dispatch) => {
        dispatch(getDashboards());

        let params = {
            limit: limit,
            textSearch: textSearch
        }

        return axios.get('http://localhost:8080/api/tenant/dashboards', {
            params: params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Authorization': 'Bearer ' + storage.read('jwt_token')
            }
        }).then((response) => {
            dispatch(getDashboardsSuccess(response.data.data));
        }).catch((error) => {
            dispatch(getDashboardsFailure());
        })
    };
};

function getDashboards() {
    return {
        type: TENANT_DASHBOARDS
    }
}

function getDashboardsSuccess(data) {
    return {
        type: TENANT_DASHBOARDS_SUCCESS,
        data: data
    }
}

function getDashboardsFailure() {
    return {
        type: TENANT_DASHBOARDS_FAILURE
    }
}