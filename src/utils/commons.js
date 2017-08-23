export const types = {
    serverErrorCode: {
        general: 2,
        authentication: 10,
        jwtTokenExpired: 11,
        permissionDenied: 20,
        invalidArguments: 30,
        badRequestParams: 31,
        itemNotFound: 32,
    },
    entryPoints: {
        login: '/api/auth/login',
        tokenRefresh: '/api/auth/token',
        nonTokenBased: '/api/noauth',
    },
    id: {
        nullUid: '13814000-1dd2-11b2-8080-808080808080',
    },
    aggregation: {
        min: {
            value: 'MIN',
            name: 'aggregation.min',
        },
        max: {
            value: 'MAX',
            name: 'aggregation.max',
        },
        avg: {
            value: 'AVG',
            name: 'aggregation.avg',
        },
        sum: {
            value: 'SUM',
            name: 'aggregation.sum',
        },
        count: {
            value: 'COUNT',
            name: 'aggregation.count',
        },
        none: {
            value: 'NONE',
            name: 'aggregation.none',
        },
    },
    alarmFields: {
        createdTime: {
            keyName: 'createdTime',
            value: 'createdTime',
            name: 'alarm.created-time',
            time: true,
        },
        startTime: {
            keyName: 'startTime',
            value: 'startTs',
            name: 'alarm.start-time',
            time: true,
        },
        endTime: {
            keyName: 'endTime',
            value: 'endTs',
            name: 'alarm.end-time',
            time: true,
        },
        ackTime: {
            keyName: 'ackTime',
            value: 'ackTs',
            name: 'alarm.ack-time',
            time: true,
        },
        clearTime: {
            keyName: 'clearTime',
            value: 'clearTs',
            name: 'alarm.clear-time',
            time: true,
        },
        originator: {
            keyName: 'originator',
            value: 'originatorName',
            name: 'alarm.originator',
        },
        originatorType: {
            keyName: 'originatorType',
            value: 'originator.entityType',
            name: 'alarm.originator-type',
        },
        type: {
            keyName: 'type',
            value: 'type',
            name: 'alarm.type',
        },
        severity: {
            keyName: 'severity',
            value: 'severity',
            name: 'alarm.severity',
        },
        status: {
            keyName: 'status',
            value: 'status',
            name: 'alarm.status',
        },
    },
    alarmStatus: {
        activeUnack: 'ACTIVE_UNACK',
        activeAck: 'ACTIVE_ACK',
        clearedUnack: 'CLEARED_UNACK',
        clearedAck: 'CLEARED_ACK',
    },
    alarmSearchStatus: {
        any: 'ANY',
        active: 'ACTIVE',
        cleared: 'CLEARED',
        ack: 'ACK',
        unack: 'UNACK',
    },
    alarmSeverity: {
        CRITICAL: {
            name: 'alarm.severity-critical',
            class: 'tb-critical',
            color: 'red',
        },
        MAJOR: {
            name: 'alarm.severity-major',
            class: 'tb-major',
            color: 'orange',
        },
        MINOR: {
            name: 'alarm.severity-minor',
            class: 'tb-minor',
            color: '#ffca3d',
        },
        WARNING: {
            name: 'alarm.severity-warning',
            class: 'tb-warning',
            color: '#abab00',
        },
        INDETERMINATE: {
            name: 'alarm.severity-indeterminate',
            class: 'tb-indeterminate',
            color: 'green',
        },
    },
    aliasFilterType: {
        entityList: {
            value: 'entityList',
            name: 'alias.filter-type-entity-list',
        },
        entityName: {
            value: 'entityName',
            name: 'alias.filter-type-entity-name',
        },
        stateEntity: {
            value: 'stateEntity',
            name: 'alias.filter-type-state-entity',
        },
        assetType: {
            value: 'assetType',
            name: 'alias.filter-type-asset-type',
        },
        deviceType: {
            value: 'deviceType',
            name: 'alias.filter-type-device-type',
        },
        relationsQuery: {
            value: 'relationsQuery',
            name: 'alias.filter-type-relations-query',
        },
        assetSearchQuery: {
            value: 'assetSearchQuery',
            name: 'alias.filter-type-asset-search-query',
        },
        deviceSearchQuery: {
            value: 'deviceSearchQuery',
            name: 'alias.filter-type-device-search-query',
        },
    },
    position: {
        top: {
            value: 'top',
            name: 'position.top',
        },
        bottom: {
            value: 'bottom',
            name: 'position.bottom',
        },
        left: {
            value: 'left',
            name: 'position.left',
        },
        right: {
            value: 'right',
            name: 'position.right',
        },
    },
    datasourceType: {
        function: 'function',
        entity: 'entity',
    },
    dataKeyType: {
        timeseries: 'timeseries',
        attribute: 'attribute',
        function: 'function',
        alarm: 'alarm',
    },
    componentType: {
        filter: 'FILTER',
        processor: 'PROCESSOR',
        action: 'ACTION',
        plugin: 'PLUGIN',
    },
    entityType: {
        device: 'DEVICE',
        asset: 'ASSET',
        rule: 'RULE',
        plugin: 'PLUGIN',
        tenant: 'TENANT',
        customer: 'CUSTOMER',
        user: 'USER',
        dashboard: 'DASHBOARD',
        alarm: 'ALARM',
    },
    entityTypeTranslations: {
        DEVICE: {
            type: 'entity.type-device',
            typePlural: 'entity.type-devices',
            list: 'entity.list-of-devices',
            nameStartsWith: 'entity.device-name-starts-with',
        },
        ASSET: {
            type: 'entity.type-asset',
            typePlural: 'entity.type-assets',
            list: 'entity.list-of-assets',
            nameStartsWith: 'entity.asset-name-starts-with',
        },
        RULE: {
            type: 'entity.type-rule',
            typePlural: 'entity.type-rules',
            list: 'entity.list-of-rules',
            nameStartsWith: 'entity.rule-name-starts-with',
        },
        PLUGIN: {
            type: 'entity.type-plugin',
            typePlural: 'entity.type-plugins',
            list: 'entity.list-of-plugins',
            nameStartsWith: 'entity.plugin-name-starts-with',
        },
        TENANT: {
            type: 'entity.type-tenant',
            typePlural: 'entity.type-tenants',
            list: 'entity.list-of-tenants',
            nameStartsWith: 'entity.tenant-name-starts-with',
        },
        CUSTOMER: {
            type: 'entity.type-customer',
            typePlural: 'entity.type-customers',
            list: 'entity.list-of-customers',
            nameStartsWith: 'entity.customer-name-starts-with',
        },
        USER: {
            type: 'entity.type-user',
            typePlural: 'entity.type-users',
            list: 'entity.list-of-users',
            nameStartsWith: 'entity.user-name-starts-with',
        },
        DASHBOARD: {
            type: 'entity.type-dashboard',
            typePlural: 'entity.type-dashboards',
            list: 'entity.list-of-dashboards',
            nameStartsWith: 'entity.dashboard-name-starts-with',
        },
        ALARM: {
            type: 'entity.type-alarm',
            typePlural: 'entity.type-alarms',
            list: 'entity.list-of-alarms',
            nameStartsWith: 'entity.alarm-name-starts-with',
        },
    },
    entitySearchDirection: {
        from: 'FROM',
        to: 'TO',
    },
    entityRelationType: {
        contains: 'Contains',
        manages: 'Manages',
    },
    eventType: {
        error: {
            value: 'ERROR',
            name: 'event.type-error',
        },
        lcEvent: {
            value: 'LC_EVENT',
            name: 'event.type-lc-event',
        },
        stats: {
            value: 'STATS',
            name: 'event.type-stats',
        },
    },
    latestTelemetry: {
        value: 'LATEST_TELEMETRY',
        name: 'attribute.scope-latest-telemetry',
        clientSide: true,
    },
    attributesScope: {
        client: {
            value: 'CLIENT_SCOPE',
            name: 'attribute.scope-client',
            clientSide: true,
        },
        server: {
            value: 'SERVER_SCOPE',
            name: 'attribute.scope-server',
            clientSide: false,
        },
        shared: {
            value: 'SHARED_SCOPE',
            name: 'attribute.scope-shared',
            clientSide: false,
        },
    },
    valueType: {
        string: {
            value: 'string',
            name: 'value.string',
            icon: 'mdi:format-text',
        },
        integer: {
            value: 'integer',
            name: 'value.integer',
            icon: 'mdi:numeric',
        },
        double: {
            value: 'double',
            name: 'value.double',
            icon: 'mdi:numeric',
        },
        boolean: {
            value: 'boolean',
            name: 'value.boolean',
            icon: 'mdi:checkbox-marked-outline',
        },
    },
    widgetType: {
        timeseries: {
            value: 'timeseries',
            name: 'widget.timeseries',
            template: {
                bundleAlias: 'charts',
                alias: 'basic_timeseries',
            },
        },
        latest: {
            value: 'latest',
            name: 'widget.latest-values',
            template: {
                bundleAlias: 'cards',
                alias: 'attributes_card',
            },
        },
        rpc: {
            value: 'rpc',
            name: 'widget.rpc',
            template: {
                bundleAlias: 'gpio_widgets',
                alias: 'basic_gpio_control',
            },
        },
        alarm: {
            value: 'alarm',
            name: 'widget.alarm',
            template: {
                bundleAlias: 'alarm_widgets',
                alias: 'alarms_table',
            },
        },
        static: {
            value: 'static',
            name: 'widget.static',
            template: {
                bundleAlias: 'cards',
                alias: 'html_card',
            },
        },
    },
    widgetActionSources: {
        headerButton: {
            name: 'widget-action.header-button',
            value: 'headerButton',
            multiple: true,
        },
    },
    widgetActionTypes: {
        openDashboardState: {
            name: 'widget-action.open-dashboard-state',
            value: 'openDashboardState',
        },
        updateDashboardState: {
            name: 'widget-action.update-dashboard-state',
            value: 'updateDashboardState',
        },
        openDashboard: {
            name: 'widget-action.open-dashboard',
            value: 'openDashboard',
        },
        custom: {
            name: 'widget-action.custom',
            value: 'custom',
        },
    },
    systemBundleAlias: {
        charts: 'charts',
        cards: 'cards',
    },
    translate: {
        customTranslationsPrefix: 'custom.',
    },
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const MIN_INTERVAL = SECOND;
const MAX_INTERVAL = 365 * 20 * DAY;

const MIN_LIMIT = 10;
const AVG_LIMIT = 200;
const MAX_LIMIT = 500;

export const times = {
    getIntervals: (min, max) => {
        const intervals = times.predefIntervals;
        min = times.boundMinInterval(min);
        max = times.boundMaxInterval(max);
        const newIntervals = [];
        for (let i in intervals) {
            const interval = intervals[i];
            if (interval.value >= min && interval.value <= max) {
                newIntervals.push(interval);
            }
        }
        return newIntervals;
    },
    getValueIntervals: (timewindow) => {
        const intervals = times.predefIntervals;
        const min = times.minIntervalLimit(timewindow);
        const max = times.maxIntervalLimit(timewindow);
        const newIntervals = [];
        intervals.forEach((interval) => {
            if (interval.value >= min && interval.value <= max) {
                newIntervals.push(interval);
            }
        });
        return newIntervals;
    },
    matchesExistingInterval: (min, max, intervalMs) => {
        const intervals = times.getIntervals(min, max);
        const matches = intervals.some((interval) => {
            return intervalMs === interval.value;
        });
        return matches;
    },
    minIntervalLimit: (timewindow) => {
        const min = timewindow / MAX_LIMIT;
        return times.boundMinInterval(min);
    },
    avgInterval: (timewindow) => {
        const avg = timewindow / AVG_LIMIT;
        return times.boundMinInterval(avg);
    },
    maxIntervalLimit: (timewindow) => {
        const max = timewindow / MIN_LIMIT;
        return times.boundMaxInterval(max);
    },
    boundMinInterval: (min) => {
        return times.toBound(min, times.MIN_INTERVAL, times.MAX_INTERVAL, times.MIN_INTERVAL);
    },
    boundMaxInterval: (max) => {
        return times.toBound(max, times.MIN_INTERVAL, times.MAX_INTERVAL, times.MAX_INTERVAL);
    },
    toBound: (value, min, max, defValue) => {
        if (value) {
            value = Math.max(value, min);
            value = Math.min(value, max);
            return value;
        }
        return defValue;
    },
    boundIntervalToTimewindow: (timewindow, intervalMs, aggType) => {
        if (aggType === types.aggregation.none.value) {
            return SECOND;
        } else {
            const min = times.minIntervalLimit(timewindow);
            const max = times.maxIntervalLimit(timewindow);
            if (intervalMs) {
                return times.toBound(intervalMs, min, max, intervalMs);
            } else {
                return times.boundToPredefinedInterval(min, max, times.avgInterval(timewindow));
            }
        }
    },
    boundToPredefinedInterval: (min, max, intervalMs) => {
        const intervals = times.getIntervals(min, max);
        let minDelta = MAX_INTERVAL;
        let boundedInterval = intervalMs || min;
        let matchedInterval;
        for (let i in intervals) {
            const interval = intervals[i];
            const delta = Math.abs(interval.value - boundedInterval);
            if (delta < minDelta) {
                matchedInterval = interval;
                minDelta = delta;
            }
        }
        boundedInterval = matchedInterval.value;
        return boundedInterval;
    },
    closestNumber: (intervals, intervalMs) => {
        const nearest = intervals.reduce((prev, curr) => {
            return (Math.abs(curr.value - intervalMs) < Math.abs(prev.value - intervalMs)) ? curr : prev;
        });
        return nearest.value;
    },
    closestName: (intervals, intervalMs) => {
        const nearest = intervals.reduce((prev, curr) => {
            return (Math.abs(curr.value - intervalMs) < Math.abs(prev.value - intervalMs)) ? curr : prev;
        });
        return nearest.name.text;
    },
    closestValue: (intervals, intervalMs) => {
        const nearest = intervals.reduce((prev, curr) => {
            return (Math.abs(curr.value - intervalMs) < Math.abs(prev.value - intervalMs)) ? curr : prev;
        });
        return nearest.name.value;
    },
    SECOND,
    MINUTE,
    HOUR,
    DAY,
    MIN_INTERVAL,
    MAX_INTERVAL,
    MIN_LIMIT,
    AVG_LIMIT,
    MAX_LIMIT,
    predefIntervals: [
        {
            name: { text: 'timeinterval.seconds-interval', value: 1 },
            value: 1 * SECOND,
        },
        {
            name: { text: 'timeinterval.seconds-interval', value: 5 },
            value: 5 * SECOND,
        },
        {
            name: { text: 'timeinterval.seconds-interval', value: 10 },
            value: 10 * SECOND,
        },
        {
            name: { text: 'timeinterval.seconds-interval', value: 15 },
            value: 15 * SECOND,
        },
        {
            name: { text: 'timeinterval.seconds-interval', value: 30 },
            value: 30 * SECOND,
        },
        {
            name: { text: 'timeinterval.minutes-interval', value: 1 },
            value: 1 * MINUTE,
        },
        {
            name: { text: 'timeinterval.minutes-interval', value: 2 },
            value: 2 * MINUTE,
        },
        {
            name: { text: 'timeinterval.minutes-interval', value: 5 },
            value: 5 * MINUTE,
        },
        {
            name: { text: 'timeinterval.minutes-interval', value: 10 },
            value: 10 * MINUTE,
        },
        {
            name: { text: 'timeinterval.minutes-interval', value: 15 },
            value: 15 * MINUTE,
        },
        {
            name: { text: 'timeinterval.minutes-interval', value: 30 },
            value: 30 * MINUTE,
        },
        {
            name: { text: 'timeinterval.hours-interval', value: 1 },
            value: 1 * HOUR,
        },
        {
            name: { text: 'timeinterval.hours-interval', value: 2 },
            value: 2 * HOUR,
        },
        {
            name: { text: 'timeinterval.hours-interval', value: 5 },
            value: 5 * HOUR,
        },
        {
            name: { text: 'timeinterval.hours-interval', value: 10 },
            value: 10 * HOUR,
        },
        {
            name: { text: 'timeinterval.hours-interval', value: 12 },
            value: 12 * HOUR,
        },
        {
            name: { text: 'timeinterval.days-interval', value: 1 },
            value: 1 * DAY,
        },
        {
            name: { text: 'timeinterval.days-interval', value: 7 },
            value: 7 * DAY,
        },
        {
            name: { text: 'timeinterval.days-interval', value: 30 },
            value: 30 * DAY,
        },
    ],
};
