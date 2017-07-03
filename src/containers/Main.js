import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Layout } from 'antd';

import MenuList from '../components/MenuList';
import Title from '../components/Title';
import * as authentication from '../actions/authentication';
import * as customers from '../actions/customers';
import * as devices from '../actions/devices';
import * as plugins from '../actions/plugins';
import * as rules from '../actions/rules';
import * as users from '../actions/users';
import * as dashboards from '../actions/dashboards';
import * as widgets from '../actions/widgets';

class Main extends Component {

    state = {
        collapsed: false,
    };

    componentDidMount() {
        console.log('Layout Render');
    }

    componentDidUpdate(prevProps, prevState) {
        const validate = this.props.isJwtTokenValid();
        if (!validate) {
            this.props.refreshJwtRequest();
        }
    }

    handleLogout = () => {
        this.props.logoutRequest();
        this.props.clearCustomersRequest();
        this.props.clearUsersRequest();
        this.props.clearPluginsRequest();
        this.props.clearDashboardsRequest();
        this.props.clearRulesRequest();
        this.props.clearWidgetsRequest();
        this.props.clearDevicesRequest();
        this.props.location.pathname = '/login';
        this.props.history.push('/login');
    }

    pathValidate = () => {
        const validate = this.props.children[1].some(element => {
            if (element.props.path === this.props.location.pathname) {
                return true;
            } else if (this.props.location.pathname.indexOf('-') !== -1) {
                return true;
            }
            return false;
        });

        return validate;
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        const { validate, currentUser } = this.props;
        if (!this.props.isRefreshTokenValid()) {
            return <Redirect to="/login" />;
        }
        if (validate.statusMessage === 'FAILURE' && typeof currentUser.authority === 'undefined') {
            return <Redirect to="/login" />;
        }
        if (!this.pathValidate()) {
            return <Redirect to="/home" />;
        }

        let matches;
        if (this.sider) {
            matches = this.sider.mql.matches;
        }
        return (
            <Layout>
                <Layout.Sider
                ref={(c) => { this.sider = c; }}
                trigger={null}
                breakpoint="sm"
                collapsedWidth="0"
                collapsed={this.state.collapsed}
                onCollapse={(collapsed, type) => { this.setState({ collapsed }); }}
                >
                    <div className="main-logo">
                        <Link to="/home">ThingStar</Link>
                    </div>
                    <MenuList authority={this.props.currentUser.authority} selectedKey={this.props.location.pathname} />
                </Layout.Sider>
                <Layout>
                    <Title
                    onLogout={this.handleLogout}
                    location={this.props.location}
                    collapsed={this.state.collapsed}
                    toggle={this.toggle}
                    matches={matches}
                    />
                    <Layout.Content className="code-box-demo">
                        {this.props.children}
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        validate: state.authentication.validate,
        currentUser: state.authentication.currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest: () => dispatch(authentication.logoutRequest()),
        refreshJwtRequest: () => dispatch(authentication.refreshJwtRequest()),
        isJwtTokenValid: authentication.isJwtTokenValid,
        isRefreshTokenValid: authentication.isRefreshTokenValid,
        clearCustomersRequest: () => dispatch(customers.clearCustomersRequest()),
        clearRulesRequest: () => dispatch(rules.clearRulesRequest()),
        clearUsersRequest: () => dispatch(users.clearUsersRequest()),
        clearDashboardsRequest: () => dispatch(dashboards.clearDashboardsRequest()),
        clearDevicesRequest: () => dispatch(devices.clearDevicesRequest()),
        clearWidgetsRequest: () => dispatch(widgets.clearWidgetsRequest()),
        clearPluginsRequest: () => dispatch(plugins.clearPluginsRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
