import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Row, Col } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;

class PluginActionForm extends Component {
    static propTypes = {
        component: PropTypes.object,
        action: PropTypes.object,
    };

    state = {
        actionSchema: {},
    };

    render() {
        const { component } = this.props;
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        const options = (<Option key={component.clazz}>{component.name}</Option>);

        const { schema, form } = component.configurationDescriptor;
        const { properties, required } = schema;
        const { configuration } = this.props.action;

        const configurationItems = Object.keys(properties).map((key) => {
            const isRequired = required.includes(key);
            const formObj = form.find(obj => key === obj || key === obj.key);
            const formAttr = _.isObject(formObj) ? { type: formObj.type, rows: formObj.rows } : { type: 'text', rows: 1 };
            return (<FormItem key={key} label={properties[key].title}>
                    {getFieldDecorator(key, {
                        initialValue: configuration ? configuration[key] : null,
                        rules: [{ required: isRequired, message: `${properties[key].title} 를 입력하세요.` }],
                    })(
                        <Input type={formAttr.type} rows={formAttr.rows}/>,
                    )}
                </FormItem>
            );
        });

        return (
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem label="이름">
                            {getFieldDecorator('name', {
                                initialValue: this.props.action.name,
                                rules: [{ required: true, message: '이름을 입력하세요', whitespace: true }],
                            })(
                                <Input />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="종류">
                            {getFieldDecorator('clazz', {
                                initialValue: component.clazz,
                                rules: [{ required: true, message: '종류를 입력하세요.' }],
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="종류"
                                    showArrow
                                    // onChange={this.handleChange}
                                >
                                    {options}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                </Row>

                {configurationItems}
            </Form>
        );
    }
}
export default Form.create()(PluginActionForm);