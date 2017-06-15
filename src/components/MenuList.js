import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

export default class MenuList extends Component {
    render() {
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                    <Link to="/home">
                        <i className="material-icons margin-right-8 vertical-middle">home</i>
                        <span className="nav-text">Home</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/plugins">
                        <i className="material-icons margin-right-8 vertical-middle">extension</i>
                        <span className="nav-text">Plguin</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/rules">
                        <i className="material-icons margin-right-8 vertical-middle">settings_ethernet</i>
                        <span className="nav-text">Rule</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link to="/customers">
                        <i className="material-icons margin-right-8 vertical-middle">people</i>
                        <span className="nav-text">Customer</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link to="/devices">
                        <i className="material-icons margin-right-8 vertical-middle">devices_other</i>
                        <span className="nav-text">Device</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="6">
                    <Link to="/widgets">
                        <i className="material-icons margin-right-8 vertical-middle">widgets</i>
                        <span className="nav-text">Widget</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="7">
                    <Link to="/dashboards">
                        <i className="material-icons margin-right-8 vertical-middle">dashboard</i>
                        <span className="nav-text">Dashboard</span>
                    </Link>
                </Menu.Item>
            </Menu>
        );
    }
}
