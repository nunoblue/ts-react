import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Authentication from '../components/Authentication';
import * as actions from '../actions/authentication';

class Login extends Component {

    constructor(props) {
        super(props);
    }

    handleLogin = (id, pw) => this.props.loginRequest(id, pw).then(() => {
        if (this.props.login.statusMessage === 'SUCCESS') {
                // create session data
            const loginData = {
                isLoggedIn: true,
                username: id,
            };

            Materialize.toast(`Welcome, ${id}!`, 2000);
            this.props.history.push('/home');
            return true;
        }
        const $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
        Materialize.toast($toastContent, 2000);
        return false;
    })

    render() {
        const statusMessage = this.props.validate.statusMessage;
        if (statusMessage !== 'FAILURE') {
            return <Redirect to="/home" />;
        }

        return (
            <div>
                <Authentication
                  mode
                  onLogin={this.handleLogin}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    login: state.authentication.login,
    validate: state.authentication.validate,
});

const mapDispatchToProps = dispatch => ({
    loginRequest: (id, pw) => dispatch(actions.loginRequest(id, pw)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
