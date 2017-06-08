import authentication from './authentication';
import devices from './devices';
import dashboards from './dashboards';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    devices,
    dashboards
});
