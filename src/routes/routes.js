import Home from '../components/Home';
import Plugins from '../containers/Plugins';
import Rules from '../containers/Rules';
import Customers from '../containers/Customers';
import Widgets from '../containers/Widgets';
import Dashboards from '../containers/Dashboards';
import Devices from '../containers/Devices';
import Users from '../containers/Users';
import Admins from '../containers/Admins';

import Dashboard from '../containers/dashboard/Dashboard';


// import asyncComponent from './components/AsyncComponent';

// const Home = asyncComponent(() => import('./components/Home').then(module => module.default), { name: 'Home' });
// const Plugins = asyncComponent(() => import('./containers/Plugins').then(module => module.default), { name: 'Plugins' });
// const Rules = asyncComponent(() => import('./containers/Rules').then(module => module.default), { name: 'Rules' });
// const Customers = asyncComponent(() => import('./containers/Customers').then(module => module.default), { name: 'Customers' });
// const Dashboards = asyncComponent(() => import('./containers/Dashboards').then(module => module.default), { name: 'Dashboards' });
// const Widgets = asyncComponent(() => import('./containers/Widgets').then(module => module.default), { name: 'Widgets' });
// const Devices = asyncComponent(() => import('./containers/Devices').then(module => module.default), { name: 'Devices' });
// const Users = asyncComponent(() => import('./containers/Users').then(module => module.default), { name: 'Users' });
// const Admins = asyncComponent(() => import('./containers/Admins').then(module => module.default), { name: 'Admins' });

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
        path: '/customers/:customerId/devices',
        component: Devices,
    },
    {
        path: '/customers/:customerId/dashboards',
        component: Dashboards,
    },
    {
        path: '/customers/:customerId/dashboards/:dashboardId',
        component: Dashboard,
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
    {
        path: '/dashboards/:dashboardId',
        component: Dashboard,
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
    },
    {
        path: '/tenants/:customerId/users',
        component: Users,
    },
    {
        path: '/widgets-bundles',
        component: Widgets,
    },
    {
        path: '/settings/general',
        component: Admins,
    },
    {
        path: '/settings/outgoing-mail',
        component: Admins,
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
