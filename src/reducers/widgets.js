import update from 'immutability-helper';

import * as WidgetsTypes from '../actions/widget/WidgetsTypes';

const initialState = {
    statusMessage: 'INIT',
    errorMessage: 'NONE',
    data: [],
};

export default function widgets(state = initialState, action) {
    switch (action.type) {
        case WidgetsTypes.API_WIDGETS.REQUEST:
            return update(state, {
                statusMessage: {
                    $set: 'WAITING',
                },
            });
        case WidgetsTypes.API_WIDGETS.SUCCESS:
            return update(state, {
                statusMessage: {
                    $set: 'SUCCESS',
                },
                data: {
                    $set: action.payload,
                },
            });
        case WidgetsTypes.API_WIDGETS.FAILURE:
            return update(state, {
                statusMessage: {
                    $set: 'FAILURE',
                },
                errorMessage: {
                    $set: action.payload,
                },
            });
        case WidgetsTypes.CLEAR_WIDGETS.REQUEST:
            return initialState;
        default:
            return state;
    }
}
