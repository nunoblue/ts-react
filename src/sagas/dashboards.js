import { call, put, fork } from 'redux-saga/effects';
import * as ActionTypes from '../actions/dashboard/DashboardsTypes';
import { clearDashboardsRequest } from '../actions/dashboard/dashboards';
import { dashboardService } from '../services/api';

function* getDashboards(limit, textSearch, authority, id) {
    console.log(limit, textSearch, authority, id);
    const test = yield call(dashboardService.getTenantDashboards(limit, textSearch, authority, id));
    console.log(test);
    yield put({ type: ActionTypes.TENANT_DASHBOARDS_SUCCESS });
}

function* clearDashboard() {
    yield call(clearDashboardsRequest);
    yield put({ type: ActionTypes.CLEAR_DASHBOARDS });
}

export default function* dashboards() {
    yield fork(clearDashboard);
    yield fork(getDashboards);
}
