import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Header from '../components/Header';
import SideBar from '../components/SideBar';

import * as actions from '../actions/authentication';

class Layout extends Component {

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
        Materialize.toast('Good Bye!', 2000);
        this.props.location.pathname = '/login';
        this.props.history.push('/login');
    }

    pathValidate = () => {
        const validate = this.props.children.some(element => element.props.path === this.props.location.pathname);
        return validate;
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
                    </div>
                </div>
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
