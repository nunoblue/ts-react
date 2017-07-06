import React, { PureComponent } from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import { translate } from 'react-i18next';

@translate(['device'], { wait: false })
class DeviceForm extends PureComponent {
    handleChange = (e) => {
        if (typeof this.props.titleChangeEvent !== 'undefined') {
            this.props.titleChangeEvent(e.target.value);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { t, options, onPressEnter, disabled, titleChangeEvent } = this.props;
        return (
            <Form layout="vertical">
                <Form.Item label={t('device.name')}>
                    {
                        getFieldDecorator('name', {
                            rules: [{ required: true, message: t('device.device-required') }],
                        })(
                            <Input onPressEnter={onPressEnter} disabled={disabled} onChange={this.handleChange} />,
                        )
                    }
                </Form.Item>
                <Form.Item label="디바이스 타입">
                    {
                        getFieldDecorator('type', {
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
                        })(<Checkbox disabled={disabled}>{t('device.is-gateway')}</Checkbox>)
                    }
                </Form.Item>
                <Form.Item label={t('device.description')}>
                    {
                        getFieldDecorator('description', {
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
