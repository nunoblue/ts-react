'use strict';

import counter from './counter';
import authentication from './authentication';
import { combineReducers } from 'redux';

export default combineReducers({
    counter,
    authentication
});