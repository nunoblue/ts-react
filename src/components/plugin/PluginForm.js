import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Form, Input, Row } from 'antd';

const FormItem = Form.Item;

class PluginForm extends Component {
    static propTypes = {
        plugin: PropTypes.object,
    };
    
    state = {
    };
    
    render() {
        return (
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <FormItem label={i18n.t('plugin.name')}>
                            {getFieldDecorator('name', {

                            })(
                                <Input />
                            )}

                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default PluginForm;