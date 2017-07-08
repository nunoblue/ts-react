import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { translate } from 'react-i18next';

import config from '../../config';

@translate(['dashboard'], { wait: false })
class DashboardForm extends Component {
    shouldCompnentUpdate(nextProps, nextState) {
        if (nextProps.data === this.props.data) {
            return false;
        }
        return true;
    }

    handleChange = (e) => {
        if (typeof this.props.titleChangeEvent !== 'undefined') {
            this.props.titleChangeEvent(e.target.value);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { t, onPressEnter, disabled, data } = this.props;
        let assignField = null;
        if (data && disabled) {
            if (typeof data.customer !== 'undefined') {
                assignField = data.customer.isPublic ? (
                    <Form.Item label={t('dashboard.public-link')}>
                        {
                            getFieldDecorator('publicLink', {
                                initialValue: `${config.apServer}/dashboards/${data.id.id}?publicId=${data.customer.id}`,
                            })(
                                <Input
                                    disabled={disabled}
                                />,
                            )
                        }
                    </Form.Item>
                ) : (
                    <Form.Item label={t('dashboard.assignedToCustomer')}>
                        {
                            getFieldDecorator('assignedToCustomer', {
                                initialValue: data.customer.title,
                            })(
                                <Input
                                    disabled={disabled}
                                />,
                            )
                        }
                    </Form.Item>
                );
            }
        }
        return (
            <Form layout="vertical">
                {assignField}
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
