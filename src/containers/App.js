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
// import Plugins from './Plugins';
// import Rules from './Rules';
// import Customers from './Customers';
// import Widgets from './Widgets';
// import Dashboards from './Dashboards';
// import Devices from './Devices';
// import Users from './Users';


import routes from '../routes';

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

    routeWithSubRoutes = (route, i) => {
        return <Route key={i} exact path={route.path} render={props => (<route.component {...props} routes={route.routes} />)} />;
    }

    mainRoute = (validation, authority) => {
        if (validation) {
            return (
                <Main history={history}>
                    <Row>
                        <Col span="2">
                            <AntSwitch checkedChildren={'Table'} unCheckedChildren={'Card'} onChange={this.changeContent} />
                        </Col>
                    </Row>
                    {
                        routes(authority).map((route, i) => (
                            this.routeWithSubRoutes(route, i)
                        ))
                    }
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
                        {this.mainRoute(validation, currentUser.authority)}
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
