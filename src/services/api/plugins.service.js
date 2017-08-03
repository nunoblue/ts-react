import { client } from '../http';
import { urlConstants } from '../constants';

const PLUGINS = urlConstants.PLUGINS;

export const getPlugins = () => (
    client.get(PLUGINS.API_PLUGINS_URL)
);

export const deletePlugin = id => (
    client.delete(`${PLUGINS.API_PLUGIN_URL}/${id}`)
);

export const deletePlugins = idArray => (
    client.all(idArray.map(id => (
        deletePlugin(id)
    )))
);

export const activatePlugin = (id, state) => (
    client.post(`${PLUGINS.API_PLUGIN_URL}/${id}/${state === 'ACTIVE' ? 'suspend' : 'activate'}`)
);

export const savePlugin = data => (
    client.post(PLUGINS.API_PLUGIN_URL, data)
);
