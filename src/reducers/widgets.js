import update from 'react-addons-update';

import {
    API_WIDGETS,
    API_WIDGETS_SUCCESS,
    API_WIDGETS_FAILURE,
    CLEAR_WIDGETS,
} from '../actions/widget/WidgetsTypes';

const initialState = {
    statusMessage: 'INIT',
    errorMessage: 'NONE',
    data: [],
};

export default function widgets(state = initialState, action) {
    switch (action.type) {
        case API_WIDGETS:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });
        case API_WIDGETS_SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.data,
                },
            });
        case API_WIDGETS_FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.errorMessage,
                },
            });
        case CLEAR_WIDGETS:
            return initialState;
        default:
            return state;
    }
}
