import storage from 'store/storages/localStorage';

import {
    WEBSOCKET_OPEN,
    WEBSOCKET_CLOSED,
    WEBSOCKET_MESSAGE,
    WEBSOCKET_CONNECT,
    WEBSOCKET_DISCONNECT,
    WEBSOCKET_SEND,
} from './TelemetryTypes';

import config from '../../config';
import { types } from '../..//utils/commons';
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

const send = (payload) => {
    return {
        type: WEBSOCKET_SEND,
        payload: payload.cmdsWrapper,
        subscribers: payload.subscribers,
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

const subscribe = (subscribers, isOpened) => (dispatch) => {
    const cmdsWrapper = {
        tsSubCmds: [],
        historyCmds: [],
        attrSubCmds: [],
    };
    Object.keys(subscribers).forEach((id) => {
        Object.assign(subscribers[id].subscriptionCommand, { cmdId: nextCmdId() });
        if (subscribers[id].type === types.dataKeyType.timeseries) {
            cmdsWrapper.tsSubCmds.push(subscribers[id].subscriptionCommand);
        } else {
            cmdsWrapper.attrSubCmds.push(subscribers[id].subscriptionCommand);
        }
    });
    const payload = {
        cmdsWrapper,
        subscribers,
    };
    if (isOpened) {
        dispatch(send(payload));
    } else {
        tryConnect(dispatch).then(() => {
            dispatch(send(payload));
        });
    }
};

export const subscribeForEntityAttributes = (attributeList, isOpened) => (dispatch) => {
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
    subscribe(subscribers, isOpened)(dispatch);
};

export const unsubscribe = (subscribers) => (dispatch) => {
    const cmdsWrapper = {
        tsSubCmds: [],
        historyCmds: [],
        attrSubCmds: [],
    };
    return new Promise((resolve, reject) => {
        Object.keys(subscribers).forEach((id) => {
            Object.assign(subscribers[id].subscriptionCommand, { unsubscribe: true });
            if (subscribers[id].type === types.dataKeyType.timeseries) {
                cmdsWrapper.tsSubCmds.push(subscribers[id].subscriptionCommand);
            } else {
                cmdsWrapper.attrSubCmds.push(subscribers[id].subscriptionCommand);
            }
        });
        const payload = {
            cmdsWrapper,
            subscribers: {},
        };
        dispatch(send(payload));
        resolve();
    });
};
