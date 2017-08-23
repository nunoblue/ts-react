import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Row, Col } from 'antd';

const FormItem = Form.Item;

class SourceForm extends Component {
    static propTypes = {
        components: PropTypes.array,
        processor: PropTypes.object,
    };

    state = {
        processorSchema: {},
    };

    properties = () => {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const clazz = getFieldValue('clazz');
        const filterSchema = clazz ? this.props.components.find(item => item.clazz === clazz) : this.state.processorSchema;

        const { schema } = filterSchema.configurationDescriptor;
        const { properties } = schema;
        const propertyAlarmIdKey = Object.keys(properties)[0];
        const propertyAlarmBodyKey = Object.keys(properties)[1];
        const propertyAlarmId = properties[propertyAlarmIdKey];
        const propertyAlarmBody = properties[propertyAlarmBodyKey];
        const processor = this.props.processor;
        let alarmIdDefaultValue;
        let alarmBodyDefaultValue;

        if (processor.configuration) {
            alarmIdDefaultValue = processor.configuration.alarmIdTemplate;
            alarmBodyDefaultValue = processor.configuration.alarmBodyTemplate;
        }
        return (
            <div>
                <FormItem label={propertyAlarmId.title}>
                    {getFieldDecorator(propertyAlarmIdKey, {
                        initialValue: alarmIdDefaultValue,
                        rules: [{ required: true, message: `${propertyAlarmId.title}를 입력하세요` }],
                    })(
                        <Input type="text" />,
                    )}
                </FormItem>
                <FormItem label={propertyAlarmBody.title}>
                    {getFieldDecorator(propertyAlarmBodyKey, {
                        initialValue: alarmBodyDefaultValue,
                        rules: [{ required: true, message: `${propertyAlarmBody.title}를 입력하세요` }],
                    })(
                        <Input type="textarea" rows={4} />,
                    )}
                </FormItem>
            </div>);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        const options = this.props.components.map(component => <Option key={component.clazz}>{component.name}</Option>);
        return (
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem label="이름">
                            {getFieldDecorator('name', {
                                initialValue: this.props.processor.name,
                                rules: [{ required: true, message: '이름을 입력하세요', whitespace: true }],
                            })(
                                <Input />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="종류">
                            {getFieldDecorator('clazz', {
                                initialValue: this.props.components[0].clazz,
                                rules: [{ required: true, message: '종류를 입력하세요.' }],
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="종류"
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
                        { this.properties() }
                </Row>
            </Form>
        );
    }
}

const ProcessorForm = Form.create()(SourceForm);
export default ProcessorForm;