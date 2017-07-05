import React, { Component } from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import { translate } from 'react-i18next';

@translate(['device'], { wait: false })
class DeviceForm extends Component {
    static defaultProps = {
        value: {
            name: undefined,
            type: undefined,
            gateway: false,
            description: undefined,
        },
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { t, value, options, onPressEnter, disabled } = this.props;
        return (
            <Form layout="vertical">
                <Form.Item label={t('device.name')}>
                    {
                        getFieldDecorator('name', {
                            initialValue: value.name,
                            rules: [{ required: true, message: t('device.device-required') }],
                        })(
                            <Input onPressEnter={onPressEnter} disabled={disabled} />,
                        )
                    }
                </Form.Item>
                <Form.Item label="디바이스 타입">
                    {
                        getFieldDecorator('type', {
                            initialValue: value.type,
                            rules: [{ required: true, message: 'Please select device type' }],
                        })(
                            <Select placeholder="Please select a type" disabled={disabled}>
                                {options.map((option) => {
                                    return (
                                        <Select.Option
                                            key={option}
                                            value={option}
                                        >
                                        {option}
                                        </Select.Option>
                                    );
                                })}
                            </Select>,
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('gateway', {
                            valuePropName: 'checked',
                            initialValue: value.gateway,
                        })(<Checkbox disabled={disabled}>{t('device.is-gateway')}</Checkbox>)
                    }
                </Form.Item>
                <Form.Item label={t('device.description')}>
                    {
                        getFieldDecorator('description', {
                            initialValue: value.description,
                        })(
                            <Input onPressEnter={onPressEnter} disabled={disabled} />,
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(DeviceForm);
