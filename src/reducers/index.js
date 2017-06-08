import authentication from './authentication';
import devices from './devices';
import dashboards from './dashboards';
import plugins from './plugins';
import rules from './rules';
import widgets from './widgets';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    devices,
    dashboards,
    plugins,
    rules,
    widgets
});
