import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { translate } from 'react-i18next';

@translate('admin', { wait: false })
class AdminGeneralSettingForm extends Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        const { t, value, onPressEnter } = this.props;
        return (
            <Form layout="vertical">
                <Form.Item label={t('admin.base-url')}>
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
