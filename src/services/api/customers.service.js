import { client } from '../http';
import { urlConstants } from '../constants';

const CUSTOMERS = urlConstants.CUSTOMERS;

export const getCustomers = (limit, textSearch) => (
    client.get(`${CUSTOMERS.CUSTOMERS_URL}`, { limit, textSearch })
);

export const getCustomerShortInfo = idArray => (
    client.all(idArray.map(id => (
        client.get(`${CUSTOMERS.SHORT_INFO_URL}/${id}/shortInfo`, null, { id })
    )))
);

export const saveCustomer = data => (
    client.post(`${CUSTOMERS.SAVE_CUSTOMER_URL}`, data)
);

export const deleteCustomer = id => (
    client.delete(`${CUSTOMERS.DELETE_CUSTOMER_URL}/${id}`)
);

export const multipleDeleteCustomer = idArray => (
    client.all(idArray.map(id => (
        deleteCustomer(id)
    )))
);
