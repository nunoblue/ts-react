import Home from './components/Home';
import Plugins from './containers/Plugins';
import Rules from './containers/Rules';
import Customers from './containers/Customers';
import Widgets from './containers/Widgets';
import Dashboards from './containers/Dashboards';
import Devices from './containers/Devices';
import Users from './containers/Users';

const TENANT_ADMIN = [
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/plugins',
        component: Plugins,
    },
    {
        path: '/rules',
        component: Rules,
    },
    {
        path: '/customers',
        component: Customers,
    },
    {
        path: '/customers/:customerId/users',
        component: Users,
    },
    {
        path: '/devices',
        component: Devices,
    },
    {
        path: '/widgets',
        component: Widgets,
    },
    {
        path: '/dashboards',
        component: Dashboards,
    },
];

const CUSTOMER_USER = [
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/devices',
        component: Devices,
    },
    {
        path: '/dashboards',
        component: Dashboards,
    },
];

const SYS_ADMIN = [
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/plugins',
        component: Plugins,
    },
    {
        path: '/rules',
        component: Rules,
    },
    {
        path: '/tenants',
        component: Customers,
        routes: [
            {
                path: '/tenants/:customerId/users',
                component: Users,
            },
        ],
    },
    {
        path: '/widgets-bundles',
        component: Widgets,
    },
    {
        path: '/settings/general',
        component: Dashboards,
    },
    {
        path: '/settings/outgoing-mal',
        component: Dashboards,
    },
];

const routes = (authority) => {
    switch (authority) {
        case 'TENANT_ADMIN':
            return TENANT_ADMIN;
        case 'CUSTOMER_USER':
            return CUSTOMER_USER;
        case 'SYS_ADMIN':
            return SYS_ADMIN;
        default:
            return TENANT_ADMIN;
    }
};

export default routes;
