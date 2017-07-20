import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { notification } from 'antd';

import Authentication from '../components/Authentication';
import * as actions from '../actions/authentication/authentication';

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
            notification.error({
                message: this.props.errorMessage,
            });
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

const mapStateToProps = (state) => ({
    login: state.authentication.login,
    validate: state.authentication.validate,
    errorMessage: state.authentication.errorMessage,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    loginRequest: actions.loginRequest,
    getUserRequest: actions.getUserRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
