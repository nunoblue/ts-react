import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout, Breadcrumb, Row, Col, Icon } from 'antd';

const PATH_NAME = {
    home: ['home', 'Home'],
    plugins: ['extension', 'Plugin'],
    rules: ['settings_ethernet', 'Rule'],
    customers: ['people', 'Customer'],
    users: ['people', 'User'],
    devices: ['devices_other', 'Device'],
    widgets: ['widgets', 'Widget'],
    dashboards: ['dashboard', 'Dashboard'],
    tenants: ['people', 'Tenant'],
    'widgets-bundles': ['widgets', 'Widgets'],
    settings: ['settings', 'System Setting'],
    general: ['settings_applications', 'General'],
    'outgoing-mail': ['mail', 'Outgoing Mail'],
};

class Title extends Component {

    static propTypes = {
        onLogout: PropTypes.func,
    }

    static defaultProps = {
        onLogout: () => {
            console.error('logout function not defined');
        },
    }

    breadCrumb = () => {
        const path = this.props.location.pathname.split('/');
        let components;
        if (path.length <= 2) {
            components = (
                <Breadcrumb.Item>
                    <i className="material-icons margin-right-8 vertical-middle">{PATH_NAME[path[1]][0]}</i>
                    {PATH_NAME[path[1]][1]}
                </Breadcrumb.Item>
            );
        } else {
            components = path.map((str, i) => {
                if (str !== '' && str.length < 16) {
                    if (str === 'settings') {
                        return (
                            <Breadcrumb.Item key={str}>
                                <i className="material-icons margin-right-8 vertical-middle">{PATH_NAME[str][0]}</i>
                                {(path.length - 1) !== i ? <Link to={`/${path[1]}/general`}>{PATH_NAME[str][1]}</Link> : PATH_NAME[str][1]}
                            </Breadcrumb.Item>
                        );
                    }
                    return (
                        <Breadcrumb.Item key={str}>
                            <i className="material-icons margin-right-8 vertical-middle">{PATH_NAME[str][0]}</i>
                            {(path.length - 1) !== i ? <Link to={`/${path[i]}`}>{PATH_NAME[str][1]}</Link> : PATH_NAME[str][1]}
                        </Breadcrumb.Item>
                    );
                }
            });
        }

        return components;
    }

    render() {
        const logoutButton = (
            <a onClick={this.props.onLogout}>
                <i className="material-icons">lock_open</i>
            </a>
        );
        return (
            <Layout.Header style={{ background: '#fff', padding: 0 }}>
                <Row>
                    <Col span={18}>
                        <Col span={this.props.matches ? 2 : 0}>
                            <Icon
                            className="trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                            />
                        </Col>
                        <Col span={this.props.matches ? 22 : 24}>
                            <Breadcrumb style={{ margin: '0px 12px' }} separator=">">
                                {this.breadCrumb()}
                            </Breadcrumb>
                        </Col>
                    </Col>
                    <Col span={6}>
                        {logoutButton}
                    </Col>
                </Row>
            </Layout.Header>
        );
    }
}

export default Title;
