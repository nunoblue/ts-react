import { createAction } from 'redux-actions';
import * as WidgetsTypes from './WidgetsTypes';
import { widgetService } from '../../services/api';
import { createRequestHelper, createAsyncRequestHelper, createActionsHelper } from '../actionHelper';

// export const getWidgetsRequest = createAsyncRequestHelper(WidgetsTypes.API_WIDGETS, widgetService.getWidgets);

export const getWidgetsRequest = createRequestHelper(WidgetsTypes.API_WIDGETS, widgetService.getWidgets);

export const clearWidgetsRequest = createAction(WidgetsTypes.CLEAR_WIDGETS.REQUEST);
