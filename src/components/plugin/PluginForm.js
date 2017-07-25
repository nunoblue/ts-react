import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Form, Input, Row, Col, Select } from 'antd';
import _ from 'lodash';

import antFormUtil from '../../utils/antFormUtil';

const FormItem = Form.Item;

class PluginForm extends Component {
    static propTypes = {
        plugin: PropTypes.object,
        pluginComponents: PropTypes.array,
        disabled: PropTypes.bool,
    };
    static defaultProps = {
        plugin: {},
    };
    state = {
        selectedPlugin: {},
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.plugin !== nextProps.plugin) {
            // console.log('componentWillReceiveProps', nextProps.plugin);
            const selectedPlugin = this.props.pluginComponents.find(item => item.clazz === nextProps.plugin.clazz);
            this.setState({
                selectedPlugin,
            });
        }
        return true;
    }

    handleChange = (clazz) => {
        const selectedPlugin = this.props.pluginComponents.find(item => item.clazz === clazz);
        this.setState({
            selectedPlugin,
        });

        const keys = this.props.form.getFieldValue('keys');
        if (keys) {
            this.props.form.setFieldsValue({
                keys: [],
            });
        }
    }

    properties = () => {
        const { selectedPlugin } = this.state;
        if (_.isEmpty(selectedPlugin)) {
            return null;
        }
        const { schema, form } = selectedPlugin.configurationDescriptor;
        const formData = this.props.plugin.configuration || {};
        return antFormUtil.getJsonSchemaFields(schema, form, formData, this.props.form, this.props.disabled);
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { plugin, disabled } = this.props;
        const description = plugin.additionalInfo ? plugin.additionalInfo.description : '';
        const Option = Select.Option;
        const options = this.props.pluginComponents.map(component => <Option key={component.clazz}>{component.name}</Option>);
        return (
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <FormItem label={i18n.t('plugin.name')}>
                            {getFieldDecorator('pluginName', {
                                initialValue: plugin.name,
                                rules: [{ required: true, message: i18n.t('plugin.name-required'), whitespace: true }],
                            })(
                                <Input placeholder={i18n.t('plugin.name')} disabled={disabled} />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem label={i18n.t('plugin.description')}>
                            {getFieldDecorator('pluginDescription', {
                                initialValue: description,
                            })(
                                <Input
                                    type="textarea"
                                    rows={3}
                                    placeholder={i18n.t('plugin.description')}
                                    disabled={disabled}
                                />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label={i18n.t('plugin.api-token')}>
                            {getFieldDecorator('apiToken', {
                                initialValue: plugin.apiToken,
                                rules: [{ required: true, message: i18n.t('plugin.api-token-required'), whitespace: true }],

                            })(
                                <Input placeholder={i18n.t('plugin.api-token')} disabled={disabled} />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label={i18n.t('plugin.type')}>
                            {getFieldDecorator('pluginType', {
                                initialValue: plugin.clazz,
                                rules: [{ required: true, message: i18n.t('plugin.type-required') }],
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={i18n.t('plugin.type-required')}
                                    showArrow
                                    onChange={this.handleChange}
                                    disabled={disabled}
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

export default Form.create()(PluginForm);
