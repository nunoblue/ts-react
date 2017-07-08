import React, { Component } from 'react';
import { Form, Input, Checkbox } from 'antd';
import { translate } from 'react-i18next';

@translate(['user'], { wait: false })
class UserForm extends Component {
    handleChange = (e) => {
        if (typeof this.props.titleChangeEvent !== 'undefined') {
            this.props.titleChangeEvent(e.target.value);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { t, onPressEnter, disabled } = this.props;
        return (
            <Form layout="vertical">
                <Form.Item label={t('user.email')}>
                    {
                        getFieldDecorator('email', {
                            rules: [{ required: true, message: t('user.email-required') }],
                        })(
                            <Input onPressEnter={onPressEnter} disabled={disabled} onChange={this.handleChange} />,
                        )
                    }
                </Form.Item>
                <Form.Item label={t('user.first-name')}>
                    {getFieldDecorator('firstName')(<Input disabled={disabled} onPressEnter={onPressEnter} />)}
                </Form.Item>
                <Form.Item label={t('user.last-name')}>
                    {getFieldDecorator('lastName')(<Input disabled={disabled} onPressEnter={onPressEnter} />)}
                </Form.Item>
                <Form.Item label={t('user.description')}>
                    {getFieldDecorator('description')(<Input disabled={disabled} onPressEnter={onPressEnter} />)}
                </Form.Item>
                <Form.Item label={t('user.default-dashboard')}>
                    {
                        getFieldDecorator('defaultDashboardFullscreen', {
                            valuePropName: 'checked',
                            initialValue: false,
                        })(
                            <Checkbox disabled={disabled}>{t('user.always-fullscreen')}</Checkbox>,
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(UserForm);
