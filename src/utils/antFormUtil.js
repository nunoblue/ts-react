import React from 'react';
import { Card, Input, InputNumber, Select, Checkbox, Form, Icon, Button } from 'antd';
import _ from 'lodash';
import i18n from 'i18next';

const FormItem = Form.Item;

let uuid = 0;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
    },
};

export default {
    getJsonSchemaFields(schema, uiSchema, formData, antForm, disabled) {
        const { getFieldDecorator, getFieldValue } = antForm;
        // const { title, type, properties, required } = schema;
        const { title, properties, required } = schema;
        const fields = [];
        _.forEach(properties, (value, key) => {
            if (value.type !== 'array') {
                const isRequired = _.includes(required, key);
                const defaultValue = value.default || '';
                const initialValue = formData[key] || defaultValue;
                const ui = _.find(uiSchema, o => o.key === key);
                fields.push(
                    <FormItem label={value.title} key={key}>
                        {getFieldDecorator(key, {
                            initialValue,
                            rules: [{
                                required: isRequired,
                                message: i18n.t('common.enter-arg', { arg: value.title }),
                            }],
                        })(
                            this.getField(value, ui, disabled),
                        )}
                    </FormItem>,
                );
            } else {
                const defaultValue = formData[key] || [];
                getFieldDecorator('keys', { initialValue: defaultValue });
                const keys = getFieldValue('keys');
                const addField = this.add.bind(this, antForm, key);

                const { title: propTitle, properties: itemProperties } = value.items;
                const { minItems } = value;
                const isRequired = minItems && minItems > 0;

                const templates = keys.map((k, index) => {
                    const templ = [];
                    Object.keys(itemProperties).forEach((itemKey, i) => {
                        const item = itemProperties[itemKey];

                        templ.push(
                            <FormItem
                                {...(i === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={i === 0 ? propTitle : ''}
                                required={false}
                                key={`${itemKey}-${k}`}
                            >
                                {getFieldDecorator(`${key}-${itemKey}-${k}`, {
                                    initialValue: !_.isEmpty(defaultValue) ? defaultValue[index].key : '',
                                    validatorTrigger: ['onChange', 'onBlur'],
                                    rules: [{
                                        required: isRequired,
                                        whitespace: true,
                                        message: i18n.t('common.enter-arg', { arg: item.title }),
                                    }],
                                })(
                                    <Input
                                        placeholder={item.title}
                                        style={{ width: '80%', marginRight: 8 }}
                                        disabled={disabled}
                                    />,
                                )}
                                { !disabled && i === 0 ? (<Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    disabled={isRequired && keys.length === 1}
                                    onClick={() => this.remove(antForm, k, isRequired)}
                                />) : ''}
                            </FormItem>,
                        );
                    });
                    return templ;
                });

                if (!disabled) {
                    templates.push(
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={addField} style={{ width: '60%' }}>
                                <Icon type="plus" /> {i18n.t('action.add')}
                            </Button>
                        </FormItem>,
                    );
                }
                fields.push(templates);
            }
        });
        if (_.isEmpty(fields)) {
            return null;
        }
        return (
            <Card title={title} style={{ width: '100%' }}>
                <div className="ant-form ant-form-horizontal">
                    {fields}
                </div>
            </Card>
        );
    },

    getField(item, ui, disabled) {
        // string, integer, number, boolean, array, object, rc-select
        const { type } = item;
        switch (type) {
            case 'string':
                // rc-select, textarea
                if (ui && ui.type === 'textarea') {
                    return (<Input type="textarea" placeholder={item.title} disabled={disabled} />);
                } else if (ui && ui.type === 'password') {
                    return (<Input type="password" placeholder={item.title} disabled={disabled} />);
                } else if (ui && ui.type === 'rc-select') {
                    const { items, multiple } = ui;
                    const Option = Select.Option;
                    const options = items.map(opt => <Option key={opt.value}>{opt.label}</Option>);
                    return (
                        <Select
                            style={{ width: '100%' }}
                            showArrow
                            multiple={multiple}
                            placeholder={item.title}
                            disabled={disabled}
                        >
                            {options}
                        </Select>
                    );
                }
                return (<Input placeholder={item.title} disabled={disabled} />);
            case 'integer':
            case 'number': {
                const validation = {};
                if (_.has(item, 'minimum')) {
                    validation.min = item.minimum;
                }
                if (_.has(item, 'maximum')) {
                    validation.max = item.maximum;
                }
                return (
                    <InputNumber
                        {...validation}
                        placeholder={item.title}
                        style={{ width: '100%' }}
                        disabled={disabled}
                    />);
            }
            case 'boolean':
                return (<Checkbox disabled={disabled} />);
            default:
                return (<Input placeholder={item.title} disabled={disabled} />);
        }
    },

    remove(form, k, isRequired) {
        const keys = form.getFieldValue('keys');
        if (isRequired && keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    },

    add(form) {
        uuid += 1;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
    },
};
