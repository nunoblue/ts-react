import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Layout } from 'antd';

import MenuList from '../components/MenuList';
import Title from '../components/Title';
import * as actions from '../actions/authentication';

const SYSTEM_PATH = ['/home', '/plugins', '/tanents', '/widgets-bundles', '/settings/general', '/settings/outgoing-mal'];
const TENANT_PATH = ['/home', '/plugins', '/rules', '/customers', '/devices', '/widgets', '/dashboards'];
const CUSTOMER_PATH = ['/home', '/devices', '/dashboards'];

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
        this.props.location.pathname = '/login';
        this.props.history.push('/login');
    }

    pathValidate = () => {
        if (this.props.currentUser.authority === 'TENANT_ADMIN') {
            const validate = TENANT_PATH.some((element) => {
                return element === this.props.location.pathname;
            });
            return validate;
        } else if (this.props.currentUser.authority === 'CUSTOMER_USER') {
            const validate = CUSTOMER_PATH.some((element) => {
                return element === this.props.location.pathname;
            });
            return validate;
        }
        const validate = SYSTEM_PATH.some((element) => {
            return element === this.props.location.pathname;
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
        logoutRequest: () => dispatch(actions.logoutRequest()),
        refreshJwtRequest: () => dispatch(actions.refreshJwtRequest()),
        isJwtTokenValid: actions.isJwtTokenValid,
        isRefreshTokenValid: actions.isRefreshTokenValid,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
