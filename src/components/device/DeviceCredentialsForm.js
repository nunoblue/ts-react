import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import i18n from 'i18next';

class DeviceCredentialsForm extends Component {
    state = {
        accessTokenExtra: `${this.props.value.length}/20`,
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                accessTokenExtra: `${nextProps.value.length}/20`,
            });
        }
    }

    accessTokenValidate = (rule, value, callback) => {
        const length = `${value}`.length;
        if (length === 0 || typeof value === 'undefined') {
            this.setState({ accessTokenExtra: '' });
            callback(`${i18n.t('device.access-token-required')} 0/20`);
            return;
        }

        if (length > 20) {
            this.setState({ accessTokenExtra: '' });
            callback(`${i18n.t('device.access-token-invalid')} ${length}/20`);
            return;
        }
        this.setState({
            accessTokenExtra: `${length}/20`,
        });
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { value, type, onChange, onPressEnter, disabled } = this.props;
        let inputField;
        if (type === 'ACCESS_TOKEN') {
            inputField = (
                <Form.Item label={i18n.t('device.access-token')} extra={this.state.accessTokenExtra}>
                    {
                        getFieldDecorator('accessToken', {
                            initialValue: value,
                            rules: [
                                { validator: this.accessTokenValidate },
                            ],
                        })(
                            <Input onPressEnter={onPressEnter} disabled={disabled} />,
                        )
                    }
                </Form.Item>
            );
        } else {
            inputField = (
                <Form.Item label={i18n.t('device.rsa-key')}>
                    {
                        getFieldDecorator('rsaPublicKey', {
                            initialValue: value,
                            rules: [{ required: true, message: i18n.t('device.rsa-key-required') }],
                        })(
                            <Input type="textarea" onPressEnter={onPressEnter} disabled={disabled} />,
                        )
                    }
                </Form.Item>
            );
        }
        return (
            <Form layout="vertical">
                <Form.Item label={i18n.t('device.credentials-type')}>
                    {
                        getFieldDecorator('type', {
                            initialValue: type,
                        })(
                            <Select placeholder="Please select a type" onChange={onChange} disabled={disabled}>
                                <Select.Option value="ACCESS_TOKEN">
                                    {'Access token'}
                                </Select.Option>
                                <Select.Option value="X509_CERTIFICATE">
                                    {'X.509 Certificate'}
                                </Select.Option>
                            </Select>,
                        )
                    }
                </Form.Item>
                {inputField}
            </Form>
        );
    }
}

export default Form.create()(DeviceCredentialsForm);
