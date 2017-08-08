const initTelemetryUri = (hostname) => {
    let telemetryUri;
    let port = location.port;
    if (location.protocol === 'https://') {
        if (!port) {
            port = '443';
        }
        telemetryUri = 'wss:';
    } else {
        if (!port) {
            port = '80';
        }
        telemetryUri = 'ws:';
    }
    // telemetryUri += `//${location.hostname}:${port}`;
    telemetryUri += `//${hostname}:${8080}`;
    telemetryUri += '/api/ws/plugins/telemetry';

    return telemetryUri;
};

const initLocationUrl = () => {
    let locationUrl;
    let port = location.port;
    if (location.protocol === 'https://') {
        if (!port) {
            port = '443';
        }
        locationUrl = 'https:';
    } else {
        if (!port) {
            port = '80';
        }
        locationUrl = 'http:';
    }

    locationUrl += `//${location.hostname}:${port}`;
    return locationUrl;
};

const config = {
    apServer: 'http://192.168.20.236:8080',
    nullUID: '13814000-1dd2-11b2-8080-808080808080',
    telemetryUri: initTelemetryUri('192.168.20.236'),
    apiHeaderPrefix: 'Bearer',
    locationUrl: initLocationUrl(),
};

export default config;
