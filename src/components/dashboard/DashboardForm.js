import React, { Component } from 'react';
import { Form, Input } from 'antd';
import i18n from 'i18next';

import config from '../../configs';

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
        const { onPressEnter, disabled, data } = this.props;
        let assignField = null;
        if (data && disabled) {
            if (typeof data.customer !== 'undefined') {
                assignField = data.customer.isPublic ? (
                    <Form.Item label={i18n.t('dashboard.public-link')}>
                        {
                            getFieldDecorator('publicLink', {
                                initialValue: `${config.apServer}/dashboards/${data.id.id}?publicId=${data.customerId.id}`,
                            })(
                                <Input
                                    disabled={disabled}
                                />,
                            )
                        }
                    </Form.Item>
                ) : (
                    <Form.Item label={i18n.t('dashboard.assignedToCustomer')}>
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
                <Form.Item label={i18n.t('dashboard.title')}>
                    {
                        getFieldDecorator('title', {
                            rules: [{ required: true, message: i18n.t('dashboard.title-required') }],
                        })(
                            <Input
                                disabled={disabled}
                                onPressEnter={onPressEnter}
                                onChange={this.handleChange}
                            />,
                        )
                    }
                </Form.Item>
                <Form.Item label={i18n.t('dashboard.description')}>
                    {getFieldDecorator('description')(<Input disabled={disabled} onPressEnter={onPressEnter} />)}
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(DashboardForm);
