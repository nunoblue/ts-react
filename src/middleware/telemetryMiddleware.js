import {
    WEBSOCKET_CONNECT,
    WEBSOCKET_DISCONNECT,
    WEBSOCKET_SEND,
} from '../actions/telemetry/TelemetryTypes';
import {
    closed,
    open,
    message,
} from '../actions/telemetry/telemetry';

/**
 * Formats args for creating the WebSocket instance
 */
const extractArgs = (config) => {
    if (config.args) {
        return config.args;
    }
    if (config.url) {
        return [config.url];
    }

    return [];
};

/**
 * Create a websocket object from the incoming config
 */
const createWebsocket = (payload) => {
    const args = extractArgs(payload);
    const websocket = (payload.websocket) ? payload.websocket : WebSocket;

    return new websocket(...args);
};

const telemetryMiddleware = () => {
    let websocket;
    const RECONNECT_INTERVAL = 2000;
    const WS_IDLE_TIMEOUT = 90000;
    let timeoutId;

    const keepAlive = (keepAliveTime) => {
        let timeout = 10000;
        if (typeof keepAliveTime !== 'undefined') {
            timeout = keepAliveTime;
        }
        if (keepAliveTime > 60000) {
            console.warn('KeepAlive timeout limited 60 sec!!, so default timeout 10 sec set.', keepAliveTime);
        }
        if (websocket.readyState === 1) {
            websocket.send('');
        }
        timeoutId = setTimeout(keepAlive, timeout);
    };

    const cancelKeepAlive = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    /**
     * A function to create the WebSocket object and attach the standard callbacks
     */
    const initialize = ({ dispatch }, action) => new Promise((resolve, reject) => {
        // Instantiate the websocket.
        websocket = createWebsocket(action.payload);

        // Setup handlers to be called like this:
        // dispatch(open(event));
        websocket.onopen = (event) => {
            dispatch(open(event));
            resolve(true);
        };
        websocket.onclose = (event) => {
            dispatch(closed(event));
            resolve(true);
        };
        websocket.onmessage = (event) => dispatch(message(event));
    });

    /**
     * Close the WebSocket connection and cleanup
     */
    const close = () => {
        if (websocket) {
            console.warn(`Closing WebSocket connection to ${websocket.url} ...`);
            websocket.close();
            websocket = null;
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    /**
     * Wait for the connection to be established.
     * @param {*} callback 
     */
    const waitForSocketConnection = (callback) => {
        setTimeout(() => {
            if (websocket.readyState === 1) {
                if (callback !== undefined) {
                    callback();
                }
                return;
            }
            waitForSocketConnection(callback);
        }, 5);
    };

    /**
     * A function to send payload the WebSocket
     * @param {*} payload
     * @param {*} callback
     */
    const send = (payload) => {
        if (websocket) {
            // waitForSocketConnection(() => {
                websocket.send(JSON.stringify(payload));
            // });
        } else {
            console.warn('WebSocket is closed, ignoring. Trigger a WEBSOCKET_CONNECT first');
        }
    };

    /**
     * The primary Redux middleware function.
     * Each of the actions handled are user-dispatched.
     */
    return (store) => (next) => (action) => {
        switch (action.type) {
            // User request to connect
            case WEBSOCKET_CONNECT:
                if (!websocket) {
                    const promise = initialize(store, action);
                    next(action);
                    return promise;
                }
                close();
                const promise = initialize(store, action);
                next(action);
                return promise;
            // User request to disconnect
            case WEBSOCKET_DISCONNECT:
                close();
                next(action);
                break;
            // User request to send a message
            case WEBSOCKET_SEND:
                send(action.payload);
                next(action);
                break;
            default:
                next(action);
                break;
        }
    };
};

export default telemetryMiddleware();
