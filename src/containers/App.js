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

    componentDidMount() {
        console.log('App Render');
        this.props.validateJwtToken().then(() => {
            this.props.refreshJwtRequest();
        }).catch((error) => {
            console.log(error);
        });
        this.props.getUserRequest();
    }

    shouldComponentUpdate(prevProps) {
        if (Object.keys(prevProps.currentUser).length === 0) {
            return false;
        }
        return true;
    }

    changeContent = (checked) => {
        this.setState({
            changeContent: checked,
        });
    }

    render() {
        const validation = this.props.validate.statusMessage === 'SUCCESS';
        return (
            <Router>
                <Layout style={{ height: '100vh' }}>
                    <Route exact path="/" render={() => (!validation ? <Redirect to="/login" /> : <Redirect to="/home" />)} />
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Main history={history} validation={validation}>
                            <Row>
                                <Col span="2">
                                    <AntSwitch checkedChildren={'Table'} unCheckedChildren={'Card'} onChange={this.changeContent} />
                                </Col>
                            </Row>
                            <Route path="/home" component={() => (<Home changeContent={this.state.changeContent} />)} />
                            <Route path="/plugins" component={() => (<Plugins changeContent={this.state.changeContent} />)} />
                            <Route path="/rules" component={() => (<Rules changeContent={this.state.changeContent} />)} />
                            <Route path="/customers" component={() => (<Customers changeContent={this.state.changeContent} />)} />
                            <Route path="/devices" component={() => (<Devices changeContent={this.state.changeContent} />)} />
                            <Route path="/widgets" component={() => (<Widgets changeContent={this.state.changeContent} />)} />
                            <Route path="/dashboards" component={() => (<Dashboards changeContent={this.state.changeContent} />)} />
                        </Main>
                    </Switch>
                </Layout>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        validate: state.authentication.validate,
        login: state.authentication.login,
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
