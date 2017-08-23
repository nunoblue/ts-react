/**
 * TELEMETRY (Web Socket)
 */
// Action types to be dispatched by the user
export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT';
export const WEBSOCKET_DISCONNECT = 'WEBSOCKET_DISCONNECT';
export const WEBSOCKET_SEND = 'WEBSOCKET_SEND';
// Action types dispatched by the WebSocket implementation
export const WEBSOCKET_OPEN = 'WEBSOCKET_OPEN';
export const WEBSOCKET_CLOSED = 'WEBSOCKET_CLOSED';
export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE';

export const SUBSCRIBERS = 'SUBSCRIBES';
export const SUBSCRIBER = 'SUBSCRIBE';
export const UNSUBSCRIBERS = 'UNSUBSCRIBERS';
export const UNSUBSCRIBER = 'UNSUBSCRIBER';
