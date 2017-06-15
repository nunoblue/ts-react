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
            if (this.props.statusMessage === 'SUCCESS') {
                this.props.history.push('/home');
                return true;
            }
            return false;
        });
        return request;
    }

    render() {
        const validate = this.props.validate === 'SUCCESS';
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
        validate: state.authentication.validate.statusMessage,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => dispatch(actions.loginRequest(id, pw)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
