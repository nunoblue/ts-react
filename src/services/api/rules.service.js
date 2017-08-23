import { client } from '../http';
import { urlConstants } from '../constants';

const RULES = urlConstants.RULES;

export const getRules = () => (
    client.get(RULES.RULES_URL)
);

export const saveRule = data => (
    client.post(RULES.API_RULE_URL, data)
);

export const deleteRule = id => (
    client.delete(`${RULES.API_RULE_URL}/${id}`)
);

export const deleteRules = idArray => (
    client.all(idArray.map(id => (
        deleteRule(id)
    )))
);

export const getComponents = componentType => (
    client.get(`${RULES.API_COMPONENTS_URL}/${componentType}`)
);

export const getComponent = clazz => (
    client.get(`${RULES.API_COMPONENT_URL}/${clazz}`)
);

export const activateRule = (id, state) => (
    client.post(`${RULES.API_RULE_URL}/${id}/${state === 'ACTIVE' ? 'suspend' : 'activate'}`)
);
