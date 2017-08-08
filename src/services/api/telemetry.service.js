import { client } from '../http';
import { urlConstants } from '../constants';

const TELEMETRY = urlConstants.TELEMETRY;

export const getEntityKeys = (entityType, entityId, type) => (
    client.get(`${TELEMETRY.API_ATTRIBUTES_URL}/${entityType}/${entityId}/keys/${type}`)
);

export const getEnityTimeseriesValues = (entityType, entityId, keys, startTs, endTs, limit) => (
    client.get(`${TELEMETRY.API_ATTRIBUTES_URL}/${entityType}/${entityId}/values/timeseries`, { keys, startTs, endTs, limit })
);

export const getEntityAttributesValues = (entityType, entityId, attributeScope, keys, config) => (
    client.get(`${TELEMETRY.API_ATTRIBUTES_URL}/${entityType}/${entityId}/values/attributes/${attributeScope}`, { keys, config })
);

export const getEntityAttributes = (entityType, entityId, attributeScope, config) => (
    client.get(`${TELEMETRY.API_ATTRIBUTES_URL}/${entityType}/${entityId}/values/attributes/${attributeScope}`, { config })
);

export const saveEntityAttributes = (entityType, entityId, attributeScope, attributesData) => (
    client.post(`${TELEMETRY.API_ATTRIBUTES_URL}/${entityType}/${entityId}/${attributeScope}`, attributesData)
);

export const deleteEntityAttributes = (entityType, entityId, attributeScope, keys) => (
    client.delete(`${TELEMETRY.API_ATTRIBUTES_URL}/${entityType}/${entityId}/${attributeScope}?keys=${keys}`)
);
