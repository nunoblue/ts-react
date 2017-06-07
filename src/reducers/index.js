import authentication from './authentication';
import devices from './devices';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    devices,
});
