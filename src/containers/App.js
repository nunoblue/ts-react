import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import { Layout } from 'antd';

import Main from './Main';
import Login from './Login';
import routes from '../routes';
import '../../less/app.less';
import * as actions from '../actions/authentication';

const history = createBrowserHistory();

class App extends Component {

    static childContextTypes = {
        currentUser: PropTypes.object,
    }

    state = {
        changeContent: false,
    }

    getChildContext() {
        return {
            currentUser: this.props.currentUser,
        };
    }

    componentDidMount() {
        console.log('App Render');
        this.props.validateJwtToken().then(() => {
            this.props.refreshJwtRequest();
        });
        this.props.getUserRequest();
    }

    routeWithSubRoutes = (route, i) => {
        return <Route key={i} exact path={route.path} render={props => (<route.component {...props} routes={route.routes} />)} />;
    }

    mainRoute = (validation, authority) => {
        if (validation) {
            return (
                <Main history={history}>
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
