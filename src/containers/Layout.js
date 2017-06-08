import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
import asyncComponent from '../components/AsyncComponent';

import * as actions from '../actions/authentication';

class Layout extends Component {

    componentDidMount() {
        console.log('Layout Render');
    }

    componentDidUpdate(prevProps, prevState) {
        let validate = this.props.isJwtTokenValid();
        if(!validate) {
            this.props.refreshJwtRequest().then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    handleLogout = () => {
        this.props.logoutRequest();
        Materialize.toast('Good Bye!', 2000);
        this.props.location.pathname = '/login';
        this.props.history.push('/login');
    }

    render() {
        const validate = this.props.validate;
        const statusMessage = this.props.statusMessage;
        if (!validate && statusMessage == 'FAILURE') {
            return <Redirect to="/login" />;
        }

        return (
            <div id="container">
                <SideBar />
                <Header
                  onLogout={this.handleLogout}
                />
                <div id="content-wrapper">
                    <div className="mui--appbar-height" />
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
        statusMessage: state.authentication.validate.statusMessage
    }
};

const mapDispatchToProps = dispatch => {
    return {
        logoutRequest: () => {
            return dispatch(actions.logoutRequest())
        },
        refreshJwtRequest: () => {
            return dispatch(actions.refreshJwtRequest())
        },
        isJwtTokenValid: actions.isJwtTokenValid
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);