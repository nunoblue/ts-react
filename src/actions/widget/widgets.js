import {
    API_WIDGETS,
    API_WIDGETS_SUCCESS,
    API_WIDGETS_FAILURE,
    CLEAR_WIDGETS,
} from './WidgetsTypes';
import { widgetService } from '../../services/api';

function getWidgets() {
    return {
        type: API_WIDGETS,
    };
}

function getWidgetsSuccess(data) {
    return {
        type: API_WIDGETS_SUCCESS,
        data,
    };
}

function getWidgetsFailure(message) {
    return {
        type: API_WIDGETS_FAILURE,
        errorMessage: message,
    };
}

function clearWidgetsSuccess() {
    return {
        type: CLEAR_WIDGETS,
    };
}

export const getWidgetsRequest = () => (dispatch) => {
    dispatch(getWidgets());

    return widgetService.getWidgets().then((response) => {
        dispatch(getWidgetsSuccess(response.data));
    }).catch((error) => {
        dispatch(getWidgetsFailure(error.message));
    });
};

export const clearWidgetsRequest = () => (dispatch) => {
    dispatch(clearWidgetsSuccess());
};
