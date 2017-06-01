'use strict';

import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';

import asyncComponent from '../components/AsyncComponent';
import About from '../components/About';
import Dashboard from '../components/Dashboard';
import NoMatch from '../components/NoMatch';
import Home from '../components/Home';

import Layout from './Layout';
import Login from './Login';
import Register from './Register';

// const About = asyncComponent(() => import('../components/About').then(module => module.default), {name: 'About'});
// const Dashboard = asyncComponent(() => import('../components/Dashboard').then(module => module.default), {name: 'Dashboard'});
// const NoMatch = asyncComponent(() => import('../components/NoMatch').then(module => module.default), {name: 'NoMatch'});
import * as actions from '../actions/authentication';

const history = createBrowserHistory();

class App extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.validateJwtToken().then((text) => {
            // console.log(text);
            this.props.refreshJwtRequest().then((text) => {
                // console.log(text);
            }).catch((error) => {
                // console.log(error);
                let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                Materialize.toast($toastContent, 2000);
            });
        }).catch((error) => {
            let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
            Materialize.toast($toastContent, 2000);
            // console.log(error);
        });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(nextProps.validate.statusMessage === 'SUCCESS' ||
    //     nextProps.validate.statusMessage === 'FAILURE')  {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    render() {
        let validate = this.props.status.validate;
        return (
            <Router>
                <div id="container">
                    <Route exact path="/" render={() => {
                        return !validate ? <Redirect to="/login" /> : <Redirect to="/home" />
                    }}/>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Layout history={history}>
                            <Route path="/home" component={Home} />
                            <Route path="/about" component={About} />
                            <Route path="/dashboard" component={Dashboard} />
                        </Layout>
                    </Switch>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
        validate: state.authentication.validate
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        refreshJwtRequest: () => {
            return dispatch(actions.refreshJwtRequest());
        },
        validateJwtToken: () => {
            return dispatch(actions.validateJwtToken(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);