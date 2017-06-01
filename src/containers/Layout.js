'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
import asyncComponent from '../components/AsyncComponent';
import About from '../components/About';
import Dashboard from '../components/Dashboard';
import NoMatch from '../components/NoMatch';

import * as actions from '../actions/authentication';

class Layout extends Component {

    handleLogout = () => {
        this.props.logoutRequest();
        Materialize.toast('Good Bye!', 2000);
        this.props.location.pathname = '/login';
        this.props.history.push('/login');
    }

    render() {
        let statusMessage = this.props.validate.statusMessage;
        if(statusMessage === 'FAILURE') {
            return <Redirect to="/login" />
        }
        return (
            <div id="container">
                <SideBar />
                <Header 
                    onLogout={this.handleLogout}/>
                <div id="content-wrapper">
                    <div className="mui--appbar-height"></div>
                    {this.props.children}
                </div>
                <Footer />
            </div>
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
        logoutRequest: () => {
            return dispatch(actions.logoutRequest());
        },
        validateJwtToken: () => {
            return dispatch(actions.validateJwtToken(true));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);