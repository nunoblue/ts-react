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
import { dashboardService } from '../../services/api';
import { isJwtTokenValid, refreshJwtRequest } from '../authentication/authentication';

let lastCmdId = 0;
let isOpened = false;
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

export const tryConnect = () => (dispatch) => {
    if (isJwtTokenValid()) {
        const token = storage.read('jwt_token');
        if (isOpened) {
            return;
        }
        return dispatch(connect(`${config.telemetryUri}?token=${token}`)).then(() => {
            isOpened = true;
        });
    }
    return refreshJwtRequest.then(() => {
        const token = storage.read('jwt_token');
        if (isOpened) {
            return;
        }
        return dispatch(connect(`${config.telemetryUri}?token=${token}`)).then(() => {
            isOpened = true;
        });
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
        tryConnect()(dispatch).then(() => {
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
        tryConnect()(dispatch).then(() => {
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

export const unsubscribeWithObjectsForEntityAttributes = subscribers => (dispatch) => {
    return unsubscribeWithObjects(subscribers)(dispatch);
};

/**
 * FOR DATASOURCE TELEMETRY ACTIONS
 */
export const subscribeWithObjectsForDataSources = (dataSources, timewindow, isOpened) => (dispatch) => {
    const subscribers = {};
    let stDiff = 0;
    const ct1 = Date.now();
    dashboardService.getServerTime().then((response) => {
        const ct2 = Date.now();
        const st = response.data;
        stDiff = Math.ceil(st - ((ct1 + ct2) / 2));
    });
    dataSources.forEach((dataSource) => {
        if (dataSource.tsKeys.length > 0) {
            if (timewindow.history) {
                const historyCommand = {
                    entityType: dataSource.entityType,
                    entityId: dataSource.entityId,
                    keys: dataSource.tsKeys,
                    startTs: timewindow.history.fixedWindow.startTimeMs,
                    endTs: timewindow.history.fixedWindow.endTimeMs,
                    interval: timewindow.history.interval,
                    limit: timewindow.aggregation.limit,
                    agg: timewindow.aggregation.type,
                };
                const subscriptionId = dataSource.entityType + dataSource.entityId + dataSource.tsKeys;
                const subscriber = {
                    id: subscriptionId,
                    historyCommand,
                    type: types.dataKeyType.timeseries,
                };
                Object.assign(subscribers, { [subscriptionId]: subscriber });
            } else {
                const subscriptionId = dataSource.entityType + dataSource.entityId + dataSource.tsKeys;
                const subscriptionCommand = {
                    entityType: dataSource.entityType,
                    entityId: dataSource.entityId,
                    keys: dataSource.tsKeys,
                };
                if (dataSource.type === types.widgetType.timeseries.value) {
                    const timewindowMs = parseInt(timewindow.realtime.timewindowMs, 10);
                    const interval = parseInt(timewindow.realtime.interval, 10);
                    let startTs = Date.now() + stDiff - timewindowMs;
                    const startDiff = startTs % interval;
                    let timeWindow = timewindowMs;
                    if (startDiff) {
                        startTs -= startDiff;
                        timeWindow += interval;
                    }
                    subscriptionCommand.startTs = startTs;
                    subscriptionCommand.timeWindow = timeWindow;
                    subscriptionCommand.interval = timewindow.aggregation.interval;
                    subscriptionCommand.limit = timewindow.aggregation.limit;
                    subscriptionCommand.agg = timewindow.aggregation.type;
                }
                const subscriber = {
                    id: subscriptionId,
                    subscriptionCommand,
                    type: types.dataKeyType.timeseries,
                };
                Object.assign(subscribers, { [subscriptionId]: subscriber });
            }
        }
        if (dataSource.attrKeys.length > 0) {
            const subscriptionId = dataSource.entityType + dataSource.entityId + dataSource.attrKeys;
            const subscriptionCommand = {
                entityType: dataSource.entityType,
                entityId: dataSource.entityId,
                keys: dataSource.attrKeys,
            };

            const subscriber = {
                id: subscriptionId,
                subscriptionCommand,
                type: types.dataKeyType.attribute,
            };
            Object.assign(subscribers, { [subscriptionId]: subscriber });
        }
    });
    subscribeWithObjects(subscribers, isOpened)(dispatch);
};

export const subscribeWithObjctForDataSource = (subscriber, isOpened) => (dispatch) => {

};
