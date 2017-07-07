import React, { Component } from 'react';
import { Form, Input, Radio } from 'antd';
import { translate } from 'react-i18next';

@translate(['dashboard'], { wait: false })
class DashboardForm extends Component {
    handleChange = (e) => {
        if (typeof this.props.titleChangeEvent !== 'undefined') {
            this.props.titleChangeEvent(e.target.value);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { t, onPressEnter, disabled } = this.props;
        return (
            <Form layout="vertical">
                <Form.Item label={t('dashboard.title')}>
                    {
                        getFieldDecorator('title', {
                            rules: [{ required: true, message: t('dashboard.title-required') }],
                        })(
                            <Input
                                disabled={disabled}
                                onPressEnter={onPressEnter}
                                onChange={this.handleChange}
                            />,
                        )
                    }
                </Form.Item>
                <Form.Item label={t('dashboard.description')}>
                    {getFieldDecorator('description')(<Input disabled={disabled} onPressEnter={onPressEnter} />)}
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(DashboardForm);
