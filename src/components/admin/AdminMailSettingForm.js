import React, { Component } from 'react';
import { Form, Input, InputNumber, Select, Col, Checkbox } from 'antd';
import { translate } from 'react-i18next';

@translate(['admin', 'common'], { wait: false })
class AdminMailSettingForm extends Component {
    state = {
        timeoutExtra: `${this.props.value.timeout.length}/6`,
        portExtra: `${this.props.value.smtpPort.length}/5`,
    }

    timeoutValidate = (rule, value, callback) => {
        const { t } = this.props;
        const length = `${value}`.length;

        if (length === 0 || typeof value === 'undefined') {
            this.setState({ timeoutExtra: '' });
            callback(`${t('admin.timeout-required')} 0/6`);
            return;
        }

        if (length > 6) {
            this.setState({ timeoutExtra: '' });
            callback(`${t('admin.timeout-invalid')} ${length}/6`);
            return;
        }
        this.setState({
            timeoutExtra: `${length}/6`,
        });
        callback();
    }

    portValidate = (rule, value, callback) => {
        const { t } = this.props;
        const length = `${value}`.length;

        if (length === 0 || typeof value === 'undefined') {
            this.setState({ portExtra: '' });
            callback(`${t('admin.smtp-port-required')} 0/5`);
            return;
        }

        if (length > 5) {
            this.setState({ portExtra: '' });
            callback(`${t('admin.smtp-port-invalid')} ${length}/5`);
            return;
        }
        this.setState({
            portExtra: `${length}/5`,
        });
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { t, value } = this.props;
        return (
            <Form layout="vertical">
                <Form.Item label={t('admin.mail-from')}>
                    {
                        getFieldDecorator('mailFrom', {
                            initialValue: value.mailFrom,
                            rules: [{ required: true, message: t('admin.mail-from-required') }],
                        })(
                            <Input onPressEnter={this.props.onPressEnter} />,
                        )
                    }
                </Form.Item>
                <Form.Item label={t('admin.smtp-protocol')}>
                    {
                        getFieldDecorator('smtpProtocol', {
                            initialValue: value.smtpProtocol,
                        })(
                            <Select placeholder="Please select a type">
                                <Select.Option value="smtp">
                                    {'SMTP'}
                                </Select.Option>
                                <Select.Option value="smtps">
                                    {'SMTPS'}
                                </Select.Option>
                            </Select>,
                        )
                    }
                </Form.Item>
                <Form.Item label={t('admin.smtp-host')}>
                    {
                        getFieldDecorator('smtpHost', {
                            initialValue: value.smtpHost,
                            rules: [{ required: true, message: t('admin.smtp-host-required') }],
                        })(<Input />)
                    }
                </Form.Item>
                <Form.Item required label={t('admin.smtp-port')} extra={this.state.portExtra}>
                    {
                        getFieldDecorator('smtpPort', {
                            initialValue: value.smtpPort,
                            rules: [
                                { validator: this.portValidate },
                            ],
                        })(<InputNumber min={1} max={65535} />)
                    }
                </Form.Item>
                <Form.Item required label={t('admin.timeout-msec')} extra={this.state.timeoutExtra}>
                    {
                        getFieldDecorator('timeout', {
                            initialValue: value.timeout,
                            rules: [
                                { validator: this.timeoutValidate },
                            ],
                        })(<InputNumber />)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('enableTls', {
                            valuePropName: 'checked',
                            initialValue: JSON.parse(value.enableTls),
                        })(<Checkbox>{t('admin.enable-tls')}</Checkbox>)
                    }
                </Form.Item>
                <Form.Item label={t('common:common.username')}>
                    {
                        getFieldDecorator('username', {
                            initialValue: value.username,
                        })(<Input />)
                    }
                </Form.Item>
                <Form.Item label={t('common:common.password')}>
                    {
                        getFieldDecorator('password', {
                            initialValue: value.password,
                        })(<Input type="password" />)
                    }
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({})(AdminMailSettingForm);
