import counter from './counter';
import authentication from './authentication';
import devices from './devices';

import { combineReducers } from 'redux';

export default combineReducers({
    counter,
    authentication,
    devices,
});
