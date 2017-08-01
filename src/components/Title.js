import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout, Breadcrumb, Row, Col, Icon } from 'antd';
import i18n from 'i18next';

const PATH_NAME = {
    home: ['home', 'home.home'],
    plugins: ['extension', 'plugin.plugins'],
    rules: ['settings_ethernet', 'rule.rules'],
    customers: ['people', 'customer.customers'],
    users: ['people', 'user.users'],
    devices: ['devices_other', 'device.devices'],
    widgets: ['widgets', 'widget.widget-bundle'],
    dashboards: ['dashboard', 'dashboard.dashboards'],
    tenants: ['people', 'tenant.tenants'],
    'widgets-bundles': ['widgets', 'widget.widget-bundle'],
    settings: ['settings', 'admin.system-settings'],
    general: ['settings_applications', 'admin.general'],
    'outgoing-mail': ['mail', 'admin.outgoing-mail'],
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
                    {i18n.t(PATH_NAME[path[1]][1])}
                </Breadcrumb.Item>
            );
        } else {
            components = path.map((str, i) => {
                if (str !== '' && str.length < 16) {
                    if (str === 'settings') {
                        return (
                            <Breadcrumb.Item key={str}>
                                <i className="material-icons margin-right-8 vertical-middle">{PATH_NAME[str][0]}</i>
                                {(path.length - 1) !== i ? <Link to={`/${path[1]}/general`}>{i18n.t(PATH_NAME[str][1])}</Link> : i18n.t(PATH_NAME[str][1])}
                            </Breadcrumb.Item>
                        );
                    }
                    return (
                        <Breadcrumb.Item key={str}>
                            <i className="material-icons margin-right-8 vertical-middle">{PATH_NAME[str][0]}</i>
                            {(path.length - 1) !== i ? <Link to={`/${path[i]}`}>{i18n.t(PATH_NAME[str][1])}</Link> : i18n.t(PATH_NAME[str][1])}
                        </Breadcrumb.Item>
                    );
                }
            });
        }

        return components;
    }

    render() {
        const logoutButton = (
            <div className="ts-sign-out">
                <a onClick={this.props.onLogout}>
                    <i className="fa fa-sign-out"></i>
                </a>
            </div>
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
