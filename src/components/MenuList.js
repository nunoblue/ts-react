import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const TENANT_ADMIN_MENU = {
    home: ['home', 'Home'],
    plugins: ['extension', 'Plugin'],
    rules: ['settings_ethernet', 'Rule'],
    customers: ['people', 'Customer'],
    devices: ['devices_other', 'Device'],
    widgets: ['widgets', 'Widget'],
    dashboards: ['dashboard', 'Dashboard'],
};
const CUSTOMER_USER_MENU = {
    home: ['home', 'Home'],
    devices: ['devices_other', 'Device'],
    dashboards: ['dashboard', 'Dashboard'],
};

const SYS_ADMIN_MENU = {
    home: ['home', 'Home'],
    plugins: ['extension', 'Plugin'],
    rules: ['settings_ethernet', 'Rule'],
    customers: ['people', 'Tenant'],
    widgets: ['widgets', 'Widget'],
    settings: ['settings', 'System Setting', {
        'settings/general': ['settings_applications', 'General'],
        'settings/outgoing-mail': ['mail', 'Outgoing Mail'],
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
                                <span className="nav-text">{TENANT_ADMIN_MENU[key][1]}</span>
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
                                <span className="nav-text">{CUSTOMER_USER_MENU[key][1]}</span>
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
                                        <span className="nav-text">{SYS_ADMIN_MENU[key][1]}</span>
                                    </span>
                                }
                            >
                                {
                                    Object.keys(SYS_ADMIN_MENU[key][2]).map((subKey) => {
                                        return (
                                            <Menu.Item key={`/${subKey}`}>
                                                <Link to={`/${subKey}`}>
                                                    <i className="material-icons margin-right-8 vertical-middle">{SYS_ADMIN_MENU[key][2][subKey][0]}</i>
                                                    <span className="nav-text">{SYS_ADMIN_MENU[key][2][subKey][1]}</span>
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
                                <span className="nav-text">{SYS_ADMIN_MENU[key][1]}</span>
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
