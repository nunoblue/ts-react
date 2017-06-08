import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';

import * as actions from '../actions/authentication';

class Layout extends Component {

    componentDidMount() {
        console.log('Layout Render');
    }

    componentDidUpdate(prevProps, prevState) {
        const validate = this.props.isJwtTokenValid();
        if (!validate) {
            this.props.refreshJwtRequest().catch((error) => {
                const $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                Materialize.toast($toastContent, 2000);
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
        if (!validate && statusMessage === 'FAILURE') {
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
                    <div className="mui-container-fluid">
                        {this.props.children}
                        <div className="mdl-grid">
                            <div className="mdl-cell mdl-cell--12-col col-centered">
                                <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                                    <i className="material-icons">add</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
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

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
