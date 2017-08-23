import { client } from '../http';
import { urlConstants } from '../constants';

const DASHBOARDS = urlConstants.DASHBOARDS;

export const getTenantDashboards = (limit, textSearch) => (
    client.get(`${DASHBOARDS.TENANT_DASHBOARDS_URL}`, { limit, textSearch })
);

export const getTenantDashboardsByTenantId = (limit, textSearch, tenantId) => (
    client.get(`${DASHBOARDS.TENANT_DASHBOARDS_BY_ID_URL}/${tenantId}`, { limit, textSearch })
);

export const getCustomerDashboards = (limit, textSearch, id) => (
    client.get(`${DASHBOARDS.CUSTOMER_DASHBOARDS_URL}/${id}/dashboards`, { limit, textSearch })
);

export const getDashboard = id => (
    client.get(`${DASHBOARDS.GET_DASHBOARD_URL}/${id}`)
);

export const getDashboardInfo = id => (
    client.get(`${DASHBOARDS.GET_DASHBOARD_INFO_URL}/${id}`)
);

export const saveDashboard = data => (
    client.post(`${DASHBOARDS.SAVE_DASHBOARD_URL}`, data)
);

export const deleteDashboard = id => (
    client.delete(`${DASHBOARDS.DELETE_DASHBOARD_URL}/${id}`)
);

export const multipleDeleteDashboard = idArray => (
    client.all(idArray.map(id => (
        deleteDashboard(id)
    )))
);

export const getServerTime = () => (
    client.get(`${DASHBOARDS.SERVERTIME_DASHBOARD_URL}`, { ignoreLoading: true })
);

export const assignDashboardToCustomer = (customerId, dashboardId) => (
    client.post(`${DASHBOARDS.ASSIGN_DASHBOARD_CUSTOMER_URL}/${customerId}/dashboard/${dashboardId}`)
);

export const multipleAssignDashboardToCustomer = (customerId, idArray) => (
    client.all(idArray.map(id => (
        assignDashboardToCustomer(customerId, id)
    )))
);

export const unassignDashboardFromCustomer = dashboardId => (
    client.delete(`${DASHBOARDS.UNASSIGN_DASHBOARD_CUSTOMER_URL}/${dashboardId}`)
);

export const makeDashboardPublic = dashboardId => (
    client.post(`${DASHBOARDS.MAKE_DASHBOARD_PUBLIC_URL}/${dashboardId}`)
);
export const assignDashboard = (customerId, id) => (
    client.post(`${DASHBOARDS.CUSTOMER_DASHBOARDS_URL}/${customerId}/dashboard/${id}`, null)
);

export const multipleAssignDashboard = (customerId, idArray) => (
    client.all(idArray.map(id => (
        assignDashboard(customerId, id)
    )))
);
