import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import { Layout } from 'antd';

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

// const About = asyncComponent(() => import('../components/About').then(module => module.default), {name: 'About'});
// const Dashboard = asyncComponent(() => import('../components/Dashboard').then(module => module.default), {name: 'Dashboard'});
// const NoMatch = asyncComponent(() => import('../components/NoMatch').then(module => module.default), {name: 'NoMatch'});
import * as actions from '../actions/authentication';

const history = createBrowserHistory();

class App extends Component {

    componentDidMount() {
        console.log('App Render');
        this.props.validateJwtToken().then((text) => {
            // console.log(text);
            this.props.refreshJwtRequest();
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const validate = this.props.status.validate && this.props.status.isLoggedIn;
        return (
            <Router>
                <Layout style={{ height: '100vh' }}>
                    <Route exact path="/" render={() => (!validate ? <Redirect to="/login" /> : <Redirect to="/home" />)} />
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Main history={history} validate={validate}>
                            <Route path="/home" component={Home} />
                            <Route path="/plugins" component={Plugins} />
                            <Route path="/rules" component={Rules} />
                            <Route path="/customers" component={Customers} />
                            <Route path="/devices" component={Devices} />
                            <Route path="/widgets" component={Widgets} />
                            <Route path="/dashboards" component={Dashboards} />
                        </Main>
                    </Switch>
                </Layout>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        refreshJwtRequest: () => dispatch(actions.refreshJwtRequest()),
        validateJwtToken: () => dispatch(actions.validateJwtToken(true)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
