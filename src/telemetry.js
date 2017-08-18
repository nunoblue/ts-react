/**
 * Command template concept
 */
const subscriptionCommand = {
    cmdId: 1, // Make a distinction subscription command with incremental count.
    type: 'ALARM', // Used to determine the type of subscription.
    resourceId: 1, // Resource identifier.
    definitionTypes: 'grms,grms_anomaly', // Definitions you are trying to subscribe to.
    startTimestamp: 1502937633000, // The start time of the subscription.
    endTimestamp: 1502937663000, // The end time of the subscription.
    timewindow: 61000, // If there is no end time, you get the end time through the time window.
    interval: 1000, // The interval for displaying the chart.
    limit: 300, // The maximum amount of data.
    unsubscribe: true, // Flags to cancel subscriptions.
};

/**
 * Subscribe to all resources by type.
 */
const subscriptionCommand = {
    cmdId: 1,
    type: 'ALARM',
    unsubscribe: true,
};

/**
 * Subscribe to type with resourceId
 */
const subscriptionCommand = {
    cmdId: 1,
    type: 'ALARM',
    resourceId: 1,
    unsubscribe: true,
};

/**
 * Subscribe to all resources with start timestamp
 */
const subscriptionCommand = {
    cmdId: 1,
    type: 'ALARM',
    startTimestamp: 1502937633000,
    timewindow: 61000,
    interval: 1000,
    limit: 300,
    unsubscribe: true,
};

/**
 * Subscribe to resource with start timestamp
 */
const subscriptionCommand = {
    cmdId: 1,
    type: 'DEVICE',
    resourceId: 1,
    startTimestamp: 1502937633000,
    timewindow: 61000,
    interval: 1000,
    limit: 300,
    unsubscribe: true,
};

/**
 * Subscribe to definitions with start timestamp
 */
const subscriptionCommand = {
    cmdId: 1,
    type: 'DEVICE',
    resourceId: 1,
    definitionTypes: 'accX,accY',
    startTimestamp: 1502937633000,
    timewindow: 61000,
    interval: 1000,
    limit: 300,
    unsubscribe: true,
};

/**
 *  Subscribe to list of resource and definitions with start timestamp
 */
const subscriptionCommands = [
    {
        cmdId: 1,
        type: 'DEVICE',
        resourceId: 1,
        definitionTypes: 'temperature,humidity',
        startTimestamp: 1502937633000,
        timewindow: 61000,
        interval: 1000,
        limit: 300,
        unsubscribe: true,
    },
    {
        cmdId: 1,
        type: 'DEVICE',
        resourceId: 1,
        definitionTypes: 'temperature,humidity',
        startTimestamp: 1502937633000,
        timewindow: 61000,
        interval: 1000,
        limit: 300,
        unsubscribe: true,
    },
];
