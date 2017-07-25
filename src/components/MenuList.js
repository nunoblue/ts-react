import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import i18n from 'i18next';

const TENANT_ADMIN_MENU = {
    home: ['home', 'home.home'],
    plugins: ['extension', 'plugin.plugins'],
    rules: ['settings_ethernet', 'rule.rules'],
    customers: ['people', 'customer.customers'],
    devices: ['devices_other', 'device.devices'],
    widgets: ['widgets', 'widget.widget-library'],
    dashboards: ['dashboard', 'dashboard.dashboards'],
};
const CUSTOMER_USER_MENU = {
    home: ['home', 'home.home'],
    devices: ['devices_other', 'device.devices'],
    dashboards: ['dashboard', 'dashboard.dashboards'],
};

const SYS_ADMIN_MENU = {
    home: ['home', 'home.home'],
    plugins: ['extension', 'plugin.plugins'],
    rules: ['settings_ethernet', 'rule.rules'],
    customers: ['people', 'tenant.tenants'],
    widgets: ['widgets', 'widget.widget-library'],
    settings: ['settings', 'admin.system-settings', {
        'settings/general': ['settings_applications', 'admin.general'],
        'settings/outgoing-mail': ['mail', 'admin.outgoing-mail'],
    }],
};
class MenuList extends Component {

    shouldComponentUpdate(prevProps, prevState) {
        if (prevProps.authority === this.props.authority) {
            return false;
        }

        return true;
    }

    components = (authority) => {
        if (typeof authority === 'undefined') {
            return null;
        }
        switch (authority) {
            case 'TENANT_ADMIN':
                return Object.keys(TENANT_ADMIN_MENU).map((key) => {
                    return (
                        <Menu.Item key={`/${key}`}>
                            <Link to={`/${key}`}>
                                <i className="material-icons margin-right-8 vertical-middle">{TENANT_ADMIN_MENU[key][0]}</i>
                                <span className="nav-text">{i18n.t(TENANT_ADMIN_MENU[key][1])}</span>
                            </Link>
                        </Menu.Item>
                    );
                });
            case 'CUSTOMER_USER':
                return Object.keys(CUSTOMER_USER_MENU).map((key) => {
                    return (
                        <Menu.Item key={`/${key}`}>
                            <Link to={`/${key}`}>
                                <i className="material-icons margin-right-8 vertical-middle">{CUSTOMER_USER_MENU[key][0]}</i>
                                <span className="nav-text">{i18n.t(CUSTOMER_USER_MENU[key][1])}</span>
                            </Link>
                        </Menu.Item>
                    );
                });
            default:
                return Object.keys(SYS_ADMIN_MENU).map((key, i) => {
                    if (SYS_ADMIN_MENU[key].length > 2) {
                        return (
                            <Menu.SubMenu
                                key={`/${key}`}
                                title={
                                    <span>
                                        <i className="material-icons margin-right-8 vertical-middle">{SYS_ADMIN_MENU[key][0]}</i>
                                        <span className="nav-text">{i18n.t(SYS_ADMIN_MENU[key][1])}</span>
                                    </span>
                                }
                            >
                                {
                                    Object.keys(SYS_ADMIN_MENU[key][2]).map((subKey) => {
                                        return (
                                            <Menu.Item key={`/${subKey}`}>
                                                <Link to={`/${subKey}`}>
                                                    <i className="material-icons margin-right-8 vertical-middle">{SYS_ADMIN_MENU[key][2][subKey][0]}</i>
                                                    <span className="nav-text">{i18n.t(SYS_ADMIN_MENU[key][2][subKey][1])}</span>
                                                </Link>
                                            </Menu.Item>
                                        );
                                    })
                                }
                            </Menu.SubMenu>
                        );
                    }
                    return (
                        <Menu.Item key={`/${key}`}>
                            <Link to={`/${key}`}>
                                <i className="material-icons margin-right-8 vertical-middle">{SYS_ADMIN_MENU[key][0]}</i>
                                <span className="nav-text">{i18n.t(SYS_ADMIN_MENU[key][1])}</span>
                            </Link>
                        </Menu.Item>
                    );
                });
        }
    }
    render() {
        const authority = this.props.authority;
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.props.selectedKey]} defaultOpenKeys={[`/${this.props.selectedKey.split('/')[1]}`]}>
                {this.components(authority)}
            </Menu>
        );
    }
}

export default MenuList;
