'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Authentication from '../components/Authentication';
import * as actions from '../actions/authentication';

class Register extends Component {

    constructor(props) {
        super(props);
        
    }

    handleRegister = (id, pw) => {
        return this.props.registerRequest(id, pw).then(
            () => {
                if(this.props.status === "SUCCESS") {
                    Materialize.toast('Success! Please log in.', 2000);
                    browserHistory.push('/login');
                    return true;
                } else {
                    /*
                        ERROR CODES:
                            1: BAD USERNAME
                            2: BAD PASSWORD
                            3: USERNAME EXISTS
                    */
                    let errorMessage = [
                        'Invalid Username',
                        'Password is too short',
                        'Username already exists'
                    ];
                    
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }

    render() {
        return (
            <div>
                <Authentication 
                mode={false}
                onRegister={this.handleRegister}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errorCode: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (id, pw) => {
            return dispatch(actions.registerRequest(id, pw));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);