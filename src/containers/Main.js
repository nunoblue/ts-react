import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, Link } from 'react-router-dom';
import { Layout, Row, Col, Switch, Spin } from 'antd';

import MenuList from '../components/MenuList';
import Title from '../components/Title';
import * as authentication from '../actions/authentication/authentication';
import { clearCustomersRequest } from '../actions/customer/customers';
import { clearDevicesRequest } from '../actions/device/devices';
import { clearPluginsRequest } from '../actions/plugin/plugins';
import { clearRulesRequest } from '../actions/rule/rules';
import { clearUsersRequest } from '../actions/user/users';
import { clearDashboardsRequest } from '../actions/dashboard/dashboards';
import { clearWidgetsRequest } from '../actions/widget/widgets';
import { clearAdminsRequest } from '../actions/admin/admins';

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
        const validate = this.props.children.some((element) => {
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
            <Layout className="ts-layout">
                <Layout.Sider
                    ref={(c) => { this.sider = c; }}
                    trigger={null}
                    breakpoint="sm"
                    collapsedWidth="0"
                    collapsed={this.state.collapsed}
                    onCollapse={(collapsed, type) => { this.setState({ collapsed }); }}
                    className="ts-layout-sider"
                >
                    <div className="main-logo">
                        <Link to="/home">
                            <img src="images/tsLogo.png" alt="ThingStar Logo" />
                        </Link>
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
                    <Layout.Content className="ts-layout-content">
                        <Spin spinning={this.state.loading}>
                            {/* <Row>
                                <Col span="2">
                                    <Switch checkedChildren={'Table'} unCheckedChildren={'Card'} onChange={this.changeContent} />
                                </Col>
                            </Row> */}
                            {this.props.children}
                        </Spin>
                    </Layout.Content>
                    <Layout.Footer style={{overflow: 'hidden', backgroundColor: '#CCCCCC', marginTop: 20, paddingTop: 10, paddingBottom: 10, paddingLeft:15, color: '#666666', textAlign: 'left', zIndex: '200'}}>
                        {'© Copyright 2017. All rights Reserved.'}
                        <div className="footer-ver">
                            <span>Version 1.0.1</span>
                        </div>
                    </Layout.Footer>
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
    clearCustomersRequest,
    clearRulesRequest,
    clearUsersRequest,
    clearDashboardsRequest,
    clearDevicesRequest,
    clearWidgetsRequest,
    clearPluginsRequest,
    clearAdminsRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
