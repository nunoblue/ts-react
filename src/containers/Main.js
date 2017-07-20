import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, Link } from 'react-router-dom';
import { Layout, Row, Col, Switch, Spin } from 'antd';

import MenuList from '../components/MenuList';
import Title from '../components/Title';
import * as authentication from '../actions/authentication/authentication';
import * as customers from '../actions/customer/customers';
import * as devices from '../actions/device/devices';
import * as plugins from '../actions/plugin/plugins';
import * as rules from '../actions/rules';
import * as users from '../actions/user/users';
import * as dashboards from '../actions/dashboard/dashboards';
import * as widgets from '../actions/widget/widgets';

class Main extends Component {

    static contextTypes = {
        currentUser: PropTypes.object,
    }

    static childContextTypes = {
        currentUser: PropTypes.object,
        pageLoading: PropTypes.func,
    }

    state = {
        collapsed: false,
        loading: false,
    };

    getChildContext() {
        return {
            currentUser: this.context.currentUser,
            pageLoading: this.pageLoading,
        };
    }

    componentDidMount() {
        console.log('Layout Render');
    }

    componentDidUpdate(prevProps, prevState) {
        const validate = authentication.isJwtTokenValid();
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
        const validate = this.props.children.some(element => {
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

    changeContent = (checked) => {
        this.setState({
            changeContent: checked,
        });
    }

    pageLoading = () => {
        this.setState({
            loading: !this.state.loading,
        });
    }

    render() {
        const { validate } = this.props;
        const { currentUser } = this.context;
        if (!authentication.isRefreshTokenValid()) {
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
                    <MenuList authority={currentUser.authority} selectedKey={this.props.location.pathname} />
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
                        <Spin spinning={this.state.loading}>
                            <Row>
                                <Col span="2">
                                    <Switch checkedChildren={'Table'} unCheckedChildren={'Card'} onChange={this.changeContent} />
                                </Col>
                            </Row>
                            {this.props.children}
                        </Spin>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    validate: state.authentication.validate,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    logoutRequest: authentication.logoutRequest,
    refreshJwtRequest: authentication.refreshJwtRequest,
    clearCustomersRequest: customers.clearCustomersRequest,
    clearRulesRequest: rules.clearRulesRequest,
    clearUsersRequest: users.clearUsersRequest,
    clearDashboardsRequest: dashboards.clearDashboardsRequest,
    clearDevicesRequest: devices.clearDevicesRequest,
    clearWidgetsRequest: widgets.clearWidgetsRequest,
    clearPluginsRequest: plugins.clearPluginsRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
