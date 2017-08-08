import storage from 'store/storages/localStorage';
import _ from 'lodash';
import {
    WEBSOCKET_OPEN,
    WEBSOCKET_CLOSED,
    WEBSOCKET_MESSAGE,
    WEBSOCKET_CONNECT,
    WEBSOCKET_DISCONNECT,
    WEBSOCKET_SEND,
    SUBSCRIBERS,
    SUBSCRIBER,
    UNSUBSCRIBERS,
    UNSUBSCRIBER,
} from './TelemetryTypes';

import config from '../../configs';
import { types } from '../../utils/commons';
import { isJwtTokenValid, refreshJwtRequest } from '../authentication/authentication';

let lastCmdId = 0;
const connect = (url) => {
    return {
        type: WEBSOCKET_CONNECT,
        payload: {
            url,
        },
    };
};

const disconnect = () => {
    return {
        type: WEBSOCKET_DISCONNECT,
    };
};

const send = (payload, isType) => {
    return {
        type: WEBSOCKET_SEND,
        payload: payload.cmdsWrapper,
        subscribers: payload.subscribers,
        subscriptions: payload.subscriptions,
        isType,
    };
};

export const open = (event) => {
    return {
        type: WEBSOCKET_OPEN,
        payload: {
            timestamp: new Date(),
            event,
        },
    };
};

export const closed = (event) => {
    return {
        type: WEBSOCKET_CLOSED,
        payload: {
            timestamp: new Date(),
            event,
        },
    };
};

export const message = (event) => {
    return {
        type: WEBSOCKET_MESSAGE,
        payload: {
            timestamp: new Date(),
            data: event.data,
            event,
        },
    };
};

const nextCmdId = () => {
    lastCmdId += 1;
    return lastCmdId;
};

const tryConnect = (dispatch) => {
    if (isJwtTokenValid()) {
        const token = storage.read('jwt_token');
        return dispatch(connect(`${config.telemetryUri}?token=${token}`));
    }
    return refreshJwtRequest.then(() => {
        const token = storage.read('jwt_token');
        return dispatch(connect(`${config.telemetryUri}?token=${token}`));
    }).catch((error) => {
        console.log(error.response.data);
    });
};

export const subscribe = (subscriber, isOpened) => (dispatch) => {
    const cmdsWrapper = {
        tsSubCmds: [],
        historyCmds: [],
        attrSubCmds: [],
    };
    const subscriptions = {};
    const cmdId = nextCmdId();
    if (subscriber.subscriptionCommand) {
        Object.assign(subscriptions, {
            [cmdId]: {
                subscriptionCommand: subscriber.subscriptionCommand,
                attributes: subscriber.attributes || {},
                type: subscriber.type || '',
            },
        });
        Object.assign(subscriber.subscriptionCommand, { cmdId });
        if (subscriber.type === types.dataKeyType.timeseries) {
            cmdsWrapper.tsSubCmds.push(subscriber.subscriptionCommand);
        } else {
            cmdsWrapper.attrSubCmds.push(subscriber.subscriptionCommand);
        }
    } else if (subscriber.historyCommand) {
        Object.assign(subscriber.historyCommand, { cmdId });
        cmdsWrapper.historyCmds.push(subscriber.historyCommand);
    }
    const payload = {
        cmdsWrapper,
        subscribers: { [subscriber.id]: subscriber },
        subscriptions,
    };
    if (isOpened) {
        dispatch(send(payload, SUBSCRIBER));
    } else {
        tryConnect(dispatch).then(() => {
            dispatch(send(payload));
        });
    }
};

export const subscribeWithObjects = (subscribers, isOpened) => (dispatch) => {
    const cmdsWrapper = {
        tsSubCmds: [],
        historyCmds: [],
        attrSubCmds: [],
    };
    const subscriptions = {};
    Object.keys(subscribers).forEach((id) => {
        const cmdId = nextCmdId();
        if (subscribers[id].subscriptionCommand) {
            Object.assign(subscriptions, {
                [cmdId]: {
                    subscriptionCommand: subscribers[id].subscriptionCommand,
                    attributes: subscribers[id].attributes || {},
                    type: subscribers[id].type || '',
                },
            });
            Object.assign(subscribers[id].subscriptionCommand, { cmdId });
            if (subscribers[id].type === types.dataKeyType.timeseries) {
                cmdsWrapper.tsSubCmds.push(subscribers[id].subscriptionCommand);
            } else {
                cmdsWrapper.attrSubCmds.push(subscribers[id].subscriptionCommand);
            }
        } else if (subscribers[id].historyCommand) {
            Object.assign(subscribers[id].historyCommand, { cmdId });
            cmdsWrapper.historyCmds.push(subscribers[id].historyCommand);
        }
    });
    const payload = {
        cmdsWrapper,
        subscribers,
        subscriptions,
    };
    if (isOpened) {
        dispatch(send(payload, SUBSCRIBERS));
    } else {
        tryConnect(dispatch).then(() => {
            dispatch(send(payload, SUBSCRIBERS));
        });
    }
};

export const unsubscribe = (subscriber) => (dispatch) => {
    const cmdsWrapper = {
        tsSubCmds: [],
        historyCmds: [],
        attrSubCmds: [],
    };
    return new Promise((resolve, reject) => {
        Object.assign(subscriber.subscriptionCommand, { unsubscribe: true });
        if (subscriber.type === types.dataKeyType.timeseries) {
            cmdsWrapper.tsSubCmds.push(subscriber.subscriptionCommand);
        } else {
            cmdsWrapper.attrSubCmds.push(subscriber.subscriptionCommand);
        }
        const payload = {
            cmdsWrapper,
            subscribers: { [subscriber.id]: subscriber },
        };
        dispatch(send(payload, UNSUBSCRIBER));
        resolve();
    });
};

export const unsubscribeWithObjects = (subscribers) => (dispatch) => {
    const cmdsWrapper = {
        tsSubCmds: [],
        historyCmds: [],
        attrSubCmds: [],
    };
    return new Promise((resolve, reject) => {
        Object.keys(subscribers).forEach((id) => {
            if (subscribers[id].subscriptionCommand) {
                Object.assign(subscribers[id].subscriptionCommand, { unsubscribe: true });
                if (subscribers[id].type === types.dataKeyType.timeseries) {
                    cmdsWrapper.tsSubCmds.push(subscribers[id].subscriptionCommand);
                } else {
                    cmdsWrapper.attrSubCmds.push(subscribers[id].subscriptionCommand);
                }
            } else if (subscribers[id].historyCommand) {
                
            }
        });
        const payload = {
            cmdsWrapper,
            subscribers,
        };
        dispatch(send(payload, UNSUBSCRIBERS));
        resolve();
    });
};

/**
 * FOR ATTRIBUTE TELEMETRY ACTIONS
 */
export const subscribeWithObjectsForEntityAttributes = (attributeList, isOpened) => (dispatch) => {
    const subscribers = {};
    attributeList.forEach((attribute) => {
        const subscriptionCommand = {
            entityType: attribute.entityType,
            entityId: attribute.entityId,
            scope: attribute.scope,
        };
        const type = attribute.scope === types.latestTelemetry.value ?
            types.dataKeyType.timeseries : types.dataKeyType.attribute;
        const subscriptionId = attribute.entityType + attribute.entityId + attribute.scope;
        const subscriber = {
            id: subscriptionId,
            subscriptionCommand,
            type,
        };
        Object.assign(subscribers, { [subscriptionId]: subscriber });
    });
    subscribeWithObjects(subscribers, isOpened)(dispatch);
};

export const subscribeWithObjectForAttribute = (attribute, isOpened) => (dispatch) => {
    const subscriptionCommand = {
        entityType: attribute.entityType,
        entityId: attribute.entityId,
        scope: attribute.scope,
    };
    const type = attribute.scope === types.latestTelemetry.value ?
        types.dataKeyType.timeseries : types.dataKeyType.attribute;
    const subscriptionId = attribute.entityType + attribute.entityId + attribute.scope;
    const subscriber = {
        id: subscriptionId,
        subscriptionCommand,
        type,
    };
    Object.assign(subscriber, { [subscriptionId]: subscriber });
    subscribe(subscriber, isOpened)(dispatch);
};

export const unsubscribeWithObjectsForEntityAttributes = (subscribers) => (dispatch) => {
    return unsubscribeWithObjects(subscribers)(dispatch);
};
