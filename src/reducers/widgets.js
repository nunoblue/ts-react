import {  
    API_WIDGETS,
    API_WIDGETS_SUCCESS,
    API_WIDGETS_FAILURE
} from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    statusMessage: 'INIT',
    data: []
}

export default function widgets(state = initialState, action) {
    switch(action.type) {
        case API_WIDGETS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING'
                }
            });
        case API_WIDGETS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS'
                },
                data: {
                    $set: action.data
                }
            });
        case API_WIDGETS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE'
                }
            });
        default:
            return state;
    }
}