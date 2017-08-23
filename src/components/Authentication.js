import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Input } from 'antd';
import i18n from 'i18next';

import CommonButton from './common/CommonButton';

class Authentication extends Component {
    static propTypes = {
        mode: PropTypes.bool,
        onLogin: PropTypes.func,
        onRegister: PropTypes.func,
    }

    static defaultProps = {
        mode: true,
        onLogin: () => {
        },
        onRegister: () => {
        },
    }

    handleLogin = () => {
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            const username = values.username;
            const password = values.password;
            this.props.onLogin(username, password).then((success) => {
                if (!success) {
                    this.setState({
                        password: '',
                    });
                }
            });
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="ts-login-form">
                <div className="outer">
                    <div className="ts-login-logo">
                        <img alt="ThingStar Symbol" src="/images/symbol.png" />
                    </div>
                    <div className="ts-login">
                        <a href="../">
                            Thing
                            <span>Star</span>
                            <i>V 1.0</i>
                        </a>
                    </div>
                    <div className="nest">
                        <div className="inner">
                            <div className="nest-body">
                                <form>
                                    <Form.Item>
                                        {
                                            getFieldDecorator('username', {
                                                rules: [
                                                    { type: 'email', message: 'The input is not valid E-mail!' },
                                                    { required: true, message: i18n.t('common.enter-username') },
                                                ],
                                            })(<Input type="email" size="large" onPressEnter={this.handleLogin} placeholder={i18n.t('login.username')} />)
                                        }
                                    </Form.Item>
                                    <Form.Item>
                                        {
                                            getFieldDecorator('password', {
                                                rules: [{ required: true, message: i18n.t('common.enter-password') }],
                                            })(<Input size="large" type="password" onPressEnter={this.handleLogin} placeholder={i18n.t('common.password')} />)
                                        }
                                    </Form.Item>
                                    <Row>
                                        <CommonButton type="primary" size="large" onClick={this.handleLogin}>
                                            {i18n.t('login.sign-in')}
                                        </CommonButton>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(Authentication);
