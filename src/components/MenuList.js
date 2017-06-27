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
        const components = authority === 'TENANT_ADMIN' ? Object.keys(TENANT_ADMIN_MENU).map((key) => {
            return (
                <Menu.Item key={`/${key}`}>
                    <Link to={`/${key}`}>
                        <i className="material-icons margin-right-8 vertical-middle">{TENANT_ADMIN_MENU[key][0]}</i>
                        <span className="nav-text">{TENANT_ADMIN_MENU[key][1]}</span>
                    </Link>
                </Menu.Item>
            );
        }) : Object.keys(CUSTOMER_USER_MENU).map((key) => {
            return (
                <Menu.Item key={`/${key}`}>
                    <Link to={`/${key}`}>
                        <i className="material-icons margin-right-8 vertical-middle">{CUSTOMER_USER_MENU[key][0]}</i>
                        <span className="nav-text">{TENANT_ADMIN_MENU[key][1]}</span>
                    </Link>
                </Menu.Item>
            );
        });

        return components;
    }
    render() {
        const authority = this.props.authority;
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.props.selectedKey]}>
                {this.components(authority)}
            </Menu>
        );
    }
}

export default MenuList;
