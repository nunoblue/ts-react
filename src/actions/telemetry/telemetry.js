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
            dispatch(send(payload, SUBSCRIBER));
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
            Object.assign(subscriptions, {
                [cmdId]: {
                    historyCommand: subscribers[id].historyCommand,
                    attributes: subscribers[id].attributes || {},
                    type: subscribers[id].type || '',
                },
            });
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
    if (!subscribers || Object.keys(subscribers).length === 0) {
        return;
    }
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

/**
 * FOR DATASOURCE TELEMETRY ACTIONS
 */
const updateToHistoryTimewindow = (dataSource, timewindow) => {
    let limit = timewindow.aggregation.limit;
    const interval = parseInt(timewindow.history.interval, 10);
    if (timewindow.aggregation.type !== types.aggregation.none.value) {
        const timewindowMs = parseInt(timewindow.history.timewindowMs, 10);
        limit = Math.ceil(timewindowMs / interval);
    }
    const keys = dataSource.keys || dataSource.tsKeys;
    const historyCommand = {
        entityType: dataSource.entityType,
        entityId: dataSource.entityId,
        keys,
        startTs: parseInt(timewindow.history.fixedTimewindow.startTimeMs, 10),
        endTs: parseInt(timewindow.history.fixedTimewindow.endTimeMs, 10),
        interval,
        limit,
        agg: timewindow.aggregation.type,
    };
    const subscriptionId = `${dataSource.entityType}${dataSource.entityId}${keys}`;
    const subscriber = {
        id: subscriptionId,
        historyCommand,
        type: types.dataKeyType.timeseries,
    };
    return { [subscriptionId]: subscriber };
};

const updateToRealtimeTimewindow = (dataSource, timewindow, stDiff) => {
    const keys = dataSource.keys || dataSource.tsKeys;
    const subscriptionCommand = {
        entityType: dataSource.entityType,
        entityId: dataSource.entityId,
        keys,
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
        let limit = timewindow.aggregation.limit;
        if (timewindow.aggregation.type !== types.aggregation.none.value) {
            limit = Math.ceil(timeWindow / interval);
        }
        subscriptionCommand.startTs = startTs;
        subscriptionCommand.timeWindow = timeWindow;
        subscriptionCommand.interval = interval;
        subscriptionCommand.limit = limit;
        subscriptionCommand.agg = timewindow.aggregation.type;
    }
    const subscriptionId = `${dataSource.entityType}${dataSource.entityId}${keys}`;
    const subscriber = {
        id: subscriptionId,
        subscriptionCommand,
        type: types.dataKeyType.timeseries,
    };
    return { [subscriptionId]: subscriber };
};

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
                const newDataSource = updateToHistoryTimewindow(dataSource, timewindow);
                Object.assign(subscribers, newDataSource);
            } else {
                const newDataSource = updateToRealtimeTimewindow(dataSource, timewindow, stDiff);
                Object.assign(subscribers, newDataSource);
            }
        }
        if (dataSource.attrKeys && dataSource.attrKeys.length > 0) {
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

export const updateWithTimewindowForDataSources = (subscribers, timewindow) => (dispatch) => {
    console.log(subscribers);
    if (!subscribers || Object.keys(subscribers).length === 0) {
        return subscribers;
    }
    let stDiff = 0;
    const ct1 = Date.now();
    dashboardService.getServerTime().then((response) => {
        const ct2 = Date.now();
        const st = response.data;
        stDiff = Math.ceil(st - ((ct1 + ct2) / 2));
    });
    const newSubscribers = _.transform(subscribers, (result, value, key) => {
        if (value.type === types.dataKeyType.timeseries) {
            if (timewindow.history) {
                if (value.subscriptionCommand) {
                    value.subscriptionCommand.type = value.type;
                    result[key] = updateToHistoryTimewindow(value.subscriptionCommand, timewindow)[key];
                } else {
                    value.historyCommand.type = value.type;
                    result[key] = updateToHistoryTimewindow(value.historyCommand, timewindow)[key];
                }
            } else {
                if (value.subscriptionCommand) {
                    value.subscriptionCommand.type = value.type;
                    result[key] = updateToRealtimeTimewindow(value.subscriptionCommand, timewindow, stDiff)[key];
                } else {
                    value.historyCommand.type = value.type;
                    result[key] = updateToRealtimeTimewindow(value.historyCommand, timewindow, stDiff)[key];
                }
            }
        }
    });
    return newSubscribers;
};
