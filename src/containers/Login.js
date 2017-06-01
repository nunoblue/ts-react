'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Authentication from '../components/Authentication';
import * as actions from '../actions/authentication';

class Login extends Component {

    constructor(props) {
        super(props);
        
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(nextProps.validate.statusMessage === 'SUCCESS' ||
    //     nextProps.validate.statusMessage === 'FAILURE') {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    handleLogin = (id, pw) => {
        return this.props.loginRequest(id, pw).then(() => {
            if(this.props.login.statusMessage === "SUCCESS") {
                // create session data
                let loginData = {
                    isLoggedIn: true,
                    username: id
                };

                Materialize.toast('Welcome, ' + id + '!', 2000);
                this.props.history.push('/home');
                return true;
            } else {
                let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                Materialize.toast($toastContent, 2000);
                return false;
            }
        });
    }
    
    render() {
        let statusMessage = this.props.validate.statusMessage;
        if(statusMessage !== 'FAILURE') {
            return <Redirect to="/home" />
        }

        return (
            <div>
                <Authentication 
                mode={true}
                onLogin={this.handleLogin}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.authentication.login,
        validate: state.authentication.validate
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(actions.loginRequest(id,pw));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);