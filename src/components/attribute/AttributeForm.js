import React, { PureComponent } from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import i18n from 'i18next';

class AttributeForm extends PureComponent {
    state = {
        type: 'text',
        value: 'String',
        placeholder: 'String Value',
        checkedValue: i18n.t('value.false'),
    }

    handleSelectValueType = (value) => {
        const { form } = this.props;
        if (value === 'String') {
            this.setState({
                type: 'text',
                value,
                placeholder: i18n.t('value.string-value'),
            });
            form.setFieldsValue({
                value: '',
            });
        } else if (value === 'Integer') {
            this.setState({
                type: 'number',
                value,
                placeholder: i18n.t('value.integer-value'),
            });
            form.setFieldsValue({
                value: 0,
            });
        } else if (value === 'Double') {
            this.setState({
                type: 'number',
                value,
                placeholder: i18n.t('value.double-value'),
            });
            form.setFieldsValue({
                value: 0,
            });
        } else {
            this.setState({
                type: 'checkbox',
                value,
                placeholder: i18n.t('value.boolean-value'),
            });
        }
    }

    handleChangeChecked = (e) => {
        this.setState({
            checkedValue: i18n.t(`value.${e.target.checked}`),
        });
    }

    handleChangeInput = (e) => {
        const { form } = this.props;
        const { value } = this.state;
        if (value === 'String') {
            form.setFieldsValue({
                value: e.target.value,
            });
        } else if (value === 'Integer') {
            form.setFieldsValue({
                value: parseInt(e.target.value, 10),
            });
        } else if (value === 'Double') {
            form.setFieldsValue({
                value: parseFloat(e.target.value),
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { onPressEnter, disabled } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const step = this.state.value === 'Double' ? { step: 'any' } : null;
        return (
            <Form layout="vertical">
                <Form.Item {...formItemLayout} label={i18n.t('attribute.key')}>
                    {
                        getFieldDecorator('key', {
                            rules: [{ required: true, message: i18n.t('attribute.key-required') }],
                        })(
                            <Input onPressEnter={onPressEnter} disabled={disabled} />,
                        )
                    }
                </Form.Item>
                <Form.Item {...formItemLayout} label={i18n.t('value.type')}>
                    <Select
                        style={{ width: 80 }}
                        defaultValue={i18n.t('value.string')}
                        onSelect={this.handleSelectValueType}
                    >
                        <Select.Option
                            key={i18n.t('value.string')}
                            value={i18n.t('value.string')}
                        >
                            {i18n.t('value.string')}
                        </Select.Option>
                        <Select.Option
                            key={i18n.t('value.integer')}
                            value={i18n.t('value.integer')}
                        >
                            {i18n.t('value.integer')}
                        </Select.Option>
                        <Select.Option
                            key={i18n.t('value.double')}
                            value={i18n.t('value.double')}
                        >
                            {i18n.t('value.double')}
                        </Select.Option>
                        <Select.Option
                            key={i18n.t('value.boolean')}
                            value={i18n.t('value.boolean')}
                        >
                            {i18n.t('value.boolean')}
                        </Select.Option>
                    </Select>
                </Form.Item>
                {
                    this.state.type === 'checkbox' ? (
                        <Form.Item {...formItemLayout} label={i18n.t('attribute.value')}>
                            {
                                getFieldDecorator('checkedValue', {
                                    rules: [{ required: true }],
                                    initialValue: false,
                                })(
                                    <Checkbox onChange={this.handleChangeChecked}>{this.state.checkedValue}</Checkbox>,
                                )
                            }
                        </Form.Item>
                    ) : (
                        <Form.Item {...formItemLayout} label={i18n.t('attribute.value')}>
                            {
                                getFieldDecorator('value', {
                                    rules: [{ required: true, message: i18n.t('attribute.value-required') }],
                                })(
                                    <Input onChange={this.handleChangeInput} type={this.state.type} {...step} />,
                                )
                            }
                        </Form.Item>
                    )
                }
            </Form>
        );
    }
}

export default Form.create()(AttributeForm);
