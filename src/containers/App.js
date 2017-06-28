import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import { Layout, Row, Col, Switch as AntSwitch } from 'antd';

import asyncComponent from '../components/AsyncComponent';
import NoMatch from '../components/NoMatch';
import Home from '../components/Home';

import Main from './Main';
import Login from './Login';
import Plugins from './Plugins';
import Rules from './Rules';
import Customers from './Customers';
import Widgets from './Widgets';
import Dashboards from './Dashboards';
import Devices from './Devices';

import '../../less/app.less';

// const About = asyncComponent(() => import('../components/About').then(module => module.default), {name: 'About'});
// const Dashboard = asyncComponent(() => import('../components/Dashboard').then(module => module.default), {name: 'Dashboard'});
// const NoMatch = asyncComponent(() => import('../components/NoMatch').then(module => module.default), {name: 'NoMatch'});
import * as actions from '../actions/authentication';

const history = createBrowserHistory();

class App extends Component {

    state = {
        changeContent: false,
    }

    componentWillMount() {
        console.log('App Render');
        this.props.validateJwtToken().then(() => {
            this.props.refreshJwtRequest();
        });
        this.props.getUserRequest();
    }

    changeContent = (checked) => {
        this.setState({
            changeContent: checked,
        });
    }

    mainRoute = (validation) => {
        if (validation) {
            return (
                <Main history={history}>
                    <Row>
                        <Col span="2">
                            <AntSwitch checkedChildren={'Table'} unCheckedChildren={'Card'} onChange={this.changeContent} />
                        </Col>
                    </Row>
                    <Route path="/home" render={() => (<Home changeContent={this.state.changeContent} />)} />
                    <Route path="/plugins" render={() => (<Plugins changeContent={this.state.changeContent} />)} />
                    <Route path="/rules" render={() => (<Rules changeContent={this.state.changeContent} />)} />
                    <Route path="/customers" render={() => (<Customers changeContent={this.state.changeContent} />)} />
                    <Route path="/devices" render={() => (<Devices changeContent={this.state.changeContent} />)} />
                    <Route path="/widgets" render={() => (<Widgets changeContent={this.state.changeContent} />)} />
                    <Route path="/dashboards" render={() => (<Dashboards changeContent={this.state.changeContent} />)} />
                </Main>
            );
        }
        if (this.props.validate.statusMessage === 'FAILURE' && typeof this.props.currentUser.authority === 'undefined') {
            return <Redirect to="/login" />;
        }
        return null;
    }

    render() {
        const { validate, currentUser } = this.props;
        const validation = validate.statusMessage === 'SUCCESS' && typeof currentUser.authority !== 'undefined';
        return (
            <Router>
                <Layout style={{ height: '100vh' }}>
                    <Route exact path="/" render={() => {
                        if (validation) {
                            return <Redirect to="/home" />;
                        } else if (validate.statusMessage === 'FAILURE' && typeof currentUser.authority === 'undefined') {
                            return <Redirect to="/login" />;
                        }
                        return null;
                    }} />
                    <Switch>
                        <Route path="/login" component={Login} />
                        {this.mainRoute(validation)}
                    </Switch>
                </Layout>
            </Router>
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
        refreshJwtRequest: () => dispatch(actions.refreshJwtRequest()),
        validateJwtToken: () => dispatch(actions.validateJwtToken(true)),
        getUserRequest: () => {
            return dispatch(actions.getUserRequest());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
