import { createAction } from 'redux-actions';
import * as WidgetsTypes from './WidgetsTypes';
import { widgetService } from '../../services/api';

function getWidgets() {
    return {
        type: WidgetsTypes.API_WIDGETS.REQUEST,
    };
}

function getWidgetsSuccess(data) {
    return {
        type: WidgetsTypes.API_WIDGETS.SUCCESS,
        data,
    };
}

function getWidgetsFailure(message) {
    return {
        type: WidgetsTypes.API_WIDGETS.FAILURE,
        errorMessage: message,
    };
}

export const getWidgetsRequest = () => async (dispatch) => {
    dispatch(getWidgets());
    try {
        const response = await widgetService.getWidgets();
        dispatch(getWidgetsSuccess(response.data));
    } catch (error) {
        dispatch(getWidgetsFailure(error.message));
    }
};

export const clearWidgetsRequest = createAction(WidgetsTypes.CLEAR_WIDGETS.REQUEST);
