import {  
    API_PLUGINS,
    API_PLUGINS_SUCCESS,
    API_PLUGINS_FAILURE
} from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    statusMessage: 'INIT',
    data: []
}

export default function plugins(state = initialState, action) {
    switch(action.type) {
        case API_PLUGINS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING'
                }
            });
        case API_PLUGINS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS'
                },
                data: {
                    $set: action.data
                }
            });
        case API_PLUGINS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE'
                }
            });
        default:
            return state;
    }
};
