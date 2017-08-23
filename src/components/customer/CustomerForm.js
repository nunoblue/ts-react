import React, { Component } from 'react';
import { Form, Input } from 'antd';
import i18n from 'i18next';

class CustomerForm extends Component {
    handleChange = (e) => {
        if (typeof this.props.titleChangeEvent !== 'undefined') {
            this.props.titleChangeEvent(e.target.value);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { disabled, onPressEnter } = this.props;
        return (
            <Form layout="vertical">
                <Form.Item label={i18n.t('customer.title')}>
                    {
                        getFieldDecorator('title', {
                            rules: [{ required: true, message: i18n.t('customer.title-required') }],
                        })(
                            <Input
                                disabled={disabled}
                                onPressEnter={onPressEnter}
                                onChange={this.handleChange}
                            />,
                        )
                    }
                </Form.Item>
                <Form.Item label={i18n.t('customer.description')}>
                    {getFieldDecorator('description')(<Input disabled={disabled} onPressEnter={onPressEnter} />)}
                </Form.Item>
                {/*<Form.Item label="국가">
                    {getFieldDecorator('country')(<Input />)}
                </Form.Item>
                <Form.Item label="시">
                    {getFieldDecorator('city')(<Input />)}
                </Form.Item>
                <Form.Item label="도">
                    {getFieldDecorator('province')(<Input />)}
                </Form.Item>
                <Form.Item label="우편번호">
                    {getFieldDecorator('zipcode')(<Input />)}
                </Form.Item>
                <Form.Item label="주소">
                    {getFieldDecorator('address')(<Input />)}
                </Form.Item>
                <Form.Item label="상세주소">
                    {getFieldDecorator('detailAddress')(<Input />)}
                </Form.Item>
                <Form.Item label="전화번호">
                    {getFieldDecorator('phoneNumber')(<Input />)}
                </Form.Item>
                <Form.Item label="Email">
                    {getFieldDecorator('email')(<Input />)}
                </Form.Item>*/}
            </Form>
        );
    }
}

export default Form.create()(CustomerForm);
