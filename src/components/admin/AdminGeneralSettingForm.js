import React, { Component } from 'react';
import { Form, Input } from 'antd';
import i18n from 'i18next';

class AdminGeneralSettingForm extends Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        const { value, onPressEnter } = this.props;
        return (
            <Form layout="vertical">
                <Form.Item label={i18n.t('admin.base-url')}>
                    {
                        getFieldDecorator('baseUrl', {
                            initialValue: value.baseUrl,
                            rules: [{ required: true, message: 'Please input the title of collection!' }],
                        })(
                            <Input onPressEnter={onPressEnter} />,
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({})(AdminGeneralSettingForm);
