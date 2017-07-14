import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Row, Col, Icon, Button } from 'antd';
import _ from 'lodash';
import styles from './FilterForm.css';


const FormItem = Form.Item;

let uuid = 0;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 6 },
    },
};

class SourceForm extends Component {
    static propTypes = {
        filters: PropTypes.array,
        filter: PropTypes.object,
    };

    state = {
        filterSchema: {},
    };

    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        uuid++;
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');

        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    properties = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const clazz = getFieldValue('clazz');
        const filterSchema = clazz ? this.props.filters.find(item => item.clazz === clazz) : this.state.filterSchema;

        if (!_.isEmpty(filterSchema) && clazz) {
            const { schema } = filterSchema.configurationDescriptor;
            const { properties } = schema;
            const propertyKey = Object.keys(properties)[0];
            const property = properties[propertyKey];
            const filter = this.props.filter;
            let defaultValue;

            switch (propertyKey) {
                case 'messageTypes': {
                    const Option = Select.Option;
                    const options = property.items.map(item => <Option key={item.value}>{item.label}</Option>);

                    if (filter.key > -1) {
                        defaultValue = filter.configuration.messageTypes.map(value => value);
                    }
                    return (<FormItem label={property.title}>
                        {getFieldDecorator('messageTypes', {
                            initialValue: defaultValue,
                            rules: [{ required: true, message: 'Message Type 선택하세요.' }],
                        })(
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Message Type을 선택하세요."
                                showArrow
                            >
                                {options}
                            </Select>,
                        )}
                    </FormItem>);
                }
                case 'filter': {
                    if (filter.key > -1) {
                        defaultValue = filter.configuration.filter;
                    }
                    return (<FormItem label={property.title}>
                        {getFieldDecorator('filterString', {
                            initialValue: defaultValue,
                            rules: [{ required: true, message: 'Filter 코드를 입력하세요' }],
                        })(
                            <Input type="textarea" rows={8} />,
                        )}
                    </FormItem>);
                }
                case 'methodNames': {
                    if (filter.key > -1) {
                        defaultValue = filter.configuration.methodNames.map(obj => obj.name);
                    }
                    getFieldDecorator('keys', { initialValue: defaultValue || [] });
                    const keys = getFieldValue('keys');
                    const templates = keys.map((k, index) => (
                        <FormItem
                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            label={index === 0 ? 'Method Names' : ''}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`methodNames-${k}`, {
                                initialValue: defaultValue ? defaultValue[index] : '',
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: 'Method Name을 입력하세요.',
                                }],
                            })(
                                <Input placeholder="Method name" style={{ width: '60%', marginRight: 8 }} />,
                            )}
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k)}
                            />
                        </FormItem>
                        ));
                    templates.push(
                        <FormItem {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                <Icon type="plus" /> Method name 추가
                            </Button>
                        </FormItem>,
                    );
                    return templates;
                }
                default:
                    return '';
            }
        }
        return null;
    };

    handleChange = (clazz) => {
        const filterSchema = this.props.filters.find(item => item.clazz === clazz);
        this.setState({
            filterSchema,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        const options = this.props.filters.map(filter => <Option key={filter.clazz}>{filter.name}</Option>);
        return (
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem label="이름">
                            {getFieldDecorator('name', {
                                initialValue: this.props.filter.name,
                                rules: [{ required: true, message: '이름을 입력하세요', whitespace: true }],
                            })(
                                <Input />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="종류">
                            {getFieldDecorator('clazz', {
                                initialValue: this.props.filter.clazz,
                                rules: [{ required: true, message: '종류를 입력하세요.' }],
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="필터 선택"
                                    showArrow
                                    onChange={this.handleChange}
                                >
                                    {options}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        { this.properties() }
                    </Col>
                </Row>
            </Form>
        );
    }
}

const FilterForm = Form.create()(SourceForm);

export default FilterForm;
