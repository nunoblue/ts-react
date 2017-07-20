import update from 'react-addons-update';

import {
    WEBSOCKET_CLOSED,
    WEBSOCKET_MESSAGE,
    WEBSOCKET_OPEN,
    WEBSOCKET_SEND,
} from '../actions/telemetry/TelemetryTypes';

const initialState = {
    subscribers: {},
    timeseries: [],
    attribute: [],
    isOpened: false,
    lastCmdId: 0,
};

const telemetry = (state = initialState, action) => {
    switch (action.type) {
        case WEBSOCKET_OPEN:
            return update(state, {
                isOpened: {
                    $set: true,
                },
            });
        case WEBSOCKET_CLOSED:
            return update(state, {
                isOpened: {
                    $set: false,
                },
            });
        case WEBSOCKET_MESSAGE:
            // Assuming that your data is a DOMString in JSON format
            const data = JSON.parse(action.payload.data);
            return state;
        case WEBSOCKET_SEND:
            return update(state, {
                subscribers: {
                    $set: action.subscribers,
                },
            });
        default:
            return state;
    }
};

export default telemetry;
