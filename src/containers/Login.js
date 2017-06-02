import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Authentication from '../components/Authentication';
import * as actions from '../actions/authentication';

class Login extends Component {

    handleLogin = (id, pw) => {
        return this.props.loginRequest(id, pw).then(() => {
            if (this.props.statusMessage === "SUCCESS") {
                Materialize.toast(`Welcome, ${id}!`, 2000);
                this.props.history.push('/home');
                return true;
            } else {
                const $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                Materialize.toast($toastContent, 2000);
                return false;
            }
        });
    }

    render() {
        const validate = this.props.validate === 'SUCCESS';
        console.log(validate);
        if (validate) {
            return <Redirect to="/home" />;
        }

        return (
            <div>
                <Authentication
                mode={true}
                onLogin={this.handleLogin}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.authentication.login.statusMessage,
        validate: state.authentication.validate.statusMessage
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(actions.loginRequest(id, pw));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
