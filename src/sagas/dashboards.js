import { call, put, fork } from 'redux-saga/effects';
import { CLEAR_DASHBOARDS } from '../actions/dashboard/DashboardsTypes';
import { clearDashboardsRequest } from '../actions/dashboard/dashboards';

function* clearDashboard() {
    yield call(clearDashboardsRequest);
    yield put({ type: CLEAR_DASHBOARDS });
}

export default function* dashboards() {
    yield fork(clearDashboard);
}
