import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Layout, Row, Col, Switch } from 'antd';

import MenuList from '../components/MenuList';
import Title from '../components/Title';
import * as actions from '../actions/authentication';

class Main extends Component {

    state = {
        collapsed: false,
        triggerIcon: false,
        changeContent: false,
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
        const validate = this.props.children.some(element => element.props.path === this.props.location.pathname);
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

    render() {
        const validate = this.props.validate;
        const statusMessage = this.props.statusMessage;
        if (!validate && statusMessage === 'FAILURE') {
            return <Redirect to="/login" />;
        }
        if (!this.pathValidate()) {
            return <Redirect to="/home" />;
        }
        let matches;
        if (this.sider) {
            matches = this.sider.mql.matches;
        }

        const childrenWithProps = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, { changeContent: this.state.changeContent });
        }, this);

        // console.log(childrenWithProps);
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
                    <MenuList />
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
                        <Row>
                            <Col span="2">
                                <Switch checkedChildren={'Table'} unCheckedChildren={'Card'} onChange={this.changeContent} />
                            </Col>
                        </Row>
                        {childrenWithProps}
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.authentication.validate.statusMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest: () => dispatch(actions.logoutRequest()),
        refreshJwtRequest: () => dispatch(actions.refreshJwtRequest()),
        isJwtTokenValid: actions.isJwtTokenValid,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
