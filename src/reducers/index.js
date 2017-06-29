import { combineReducers } from 'redux';

import authentication from './authentication';
import devices from './devices';
import dashboards from './dashboards';
import plugins from './plugins';
import rules from './rules';
import widgets from './widgets';
import customers from './customers';
import users from './users';

export default combineReducers({
    authentication,
    devices,
    dashboards,
    plugins,
    rules,
    widgets,
    customers,
    users,
});
