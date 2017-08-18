import update from 'immutability-helper';
import _ from 'lodash';

import {
    WEBSOCKET_CLOSED,
    WEBSOCKET_MESSAGE,
    WEBSOCKET_OPEN,
    WEBSOCKET_SEND,
    SUBSCRIBERS,
    SUBSCRIBER,
    UNSUBSCRIBERS,
    UNSUBSCRIBER,
} from '../actions/telemetry/TelemetryTypes';

const initialState = {
    subscribers: {},
    subscriptions: {},
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
            if (data) {
                if (data.subscriptionId) {
                    const subscription = state.subscriptions[data.subscriptionId];
                    if (subscription) {
                        if (data.data) {
                            return update(state, {
                                subscriptions: {
                                    [data.subscriptionId]: {
                                        attributes: {
                                            $merge: _.transform(data.data, (result, value, key) => {
                                                const telemetryArray = value.map((timeseries) => {
                                                    return {
                                                        lastUpdateTs: timeseries[0],
                                                        value: timeseries[1],
                                                    };
                                                });
                                                result[key] = telemetryArray;
                                            }),
                                        },
                                    },
                                },
                            });
                        }
                    }
                }
            }
            return state;
        case WEBSOCKET_SEND:
            if (action.isType === SUBSCRIBERS) {
                return update(state, {
                    subscribers: {
                        $merge: action.subscribers,
                    },
                    subscriptions: {
                        $merge: action.subscriptions,
                    },
                });
            } else if (action.isType === SUBSCRIBER) {
                return update(state, {
                    subscribers: {
                        $merge: action.subscribers,
                    },
                    subscriptions: {
                        $merge: action.subscriptions,
                    },
                });
            } else if (action.isType === UNSUBSCRIBERS) {
                Object.keys(action.subscribers).forEach((id) => {
                    let cmdId;
                    if (state.subscribers[id].subscriptionCommand) {
                        cmdId = state.subscribers[id].subscriptionCommand.cmdId;
                    } else {
                        cmdId = state.subscribers[id].historyCommand.cmdId;
                    }
                    delete state.subscriptions[cmdId];
                    delete state.subscribers[id];
                });
                return update(state, {
                    subscribers: {
                        $set: state.subscribers,
                    },
                    subscriptions: {
                        $set: state.subscriptions,
                    },
                });
            } else if (action.isType === UNSUBSCRIBER) {
                const id = Object.keys(action.subscribers)[0];
                let cmdId;
                if (action.subscribers[id].subscriptionCommand) {
                    cmdId = action.subscribers[id].subscriptionCommand.cmdId;
                } else {
                    cmdId = action.subscribers[id].historyCommand.cmdId;
                }
                delete state.subscriptions[cmdId];
                delete state.subscribers[id];
                return update(state, {
                    subscribers: {
                        $set: state.subscribers,
                    },
                    subscriptions: {
                        $set: state.subscriptions,
                    },
                });
            }
        default:
            return state;
    }
};

export default telemetry;
