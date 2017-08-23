/*
    Creates $NAME_REQUEST, $NAME_SUCESS, $NAME_FAILURE actions
    accessed by $NAME.$STATE, e.g. FETCH_MESSAGE.REQUEST
*/
import { createAction } from 'redux-actions';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

export const createActionTypes = (base) => {
    return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
        acc[type] = `${base}_${type}`;
        return acc;
    }, {});
};

export const createActionHelper = (base) => {
    return createAction(base);
};

export const createActionsHelper = (base) => {
    return Object.keys(base).reduce((acc, type) => {
        acc[type] = createAction(base[type]);
        return acc;
    }, {});
};

export const createRequestHelper = (base, api, payload, headers) => () => (dispatch) => {
    const actionCreators = createActionsHelper(base);
    dispatch(actionCreators.REQUEST());
    return api(payload, headers).then((response) => {
        dispatch(actionCreators.SUCCESS(response.data));
    }).catch((error) => {
        dispatch(actionCreators.FAILURE(error.message));
    });
};

export const createAsyncRequestHelper = (base, api, payload, headers) => () => async (dispatch) => {
    const actionCreators = createActionsHelper(base);
    dispatch(actionCreators.REQUEST());
    try {
        const response = await api(payload, headers);
        dispatch(actionCreators.SUCCESS(response.data));
    } catch (error) {
        dispatch(actionCreators.FAILURE(error.message));
    }
};
