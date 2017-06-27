import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Authentication from '../components/Authentication';
import * as actions from '../actions/authentication';

class Login extends Component {

    componentDidMount() {
        console.log('Login Render');
    }

    handleLogin = (id, pw) => {
        const request = this.props.loginRequest(id, pw).then(() => {
            if (this.props.login.statusMessage === 'SUCCESS') {
                this.props.getUserRequest().then(() => {
                    if (this.props.validate.statusMessage === 'SUCCESS') {
                        this.props.history.push('/home');
                    }
                });
                return true;
            }
            return false;
        });
        return request;
    }

    render() {
        const validate = this.props.validate.statusMessage === 'SUCCESS';
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
        login: state.authentication.login,
        validate: state.authentication.validate,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => dispatch(actions.loginRequest(id, pw)),
        getUserRequest: () => {
            return dispatch(actions.getUserRequest());
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
