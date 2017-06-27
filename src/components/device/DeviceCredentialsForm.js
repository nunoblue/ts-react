import React from 'react';
import { Form, Input, Select } from 'antd';

const DeviceCredentialsForm = Form.create()(
    (props) => {
        const { getFieldDecorator } = props.form;
        let inputField;
        if (props.type === 'ACCESS_TOKEN') {
            inputField = (
                <Form.Item label="액세스 토큰">
                    {
                        getFieldDecorator('accessToken', {
                            initialValue: props.value,
                        })(
                            <Input onPressEnter={props.onPressEnter} />,
                        )
                    }
                </Form.Item>
            );
        } else {
            inputField = (
                <Form.Item label="RSA public key">
                    {
                        getFieldDecorator('rsaPublicKey', {
                            initialValue: props.value,
                        })(
                            <Input type="textarea" onPressEnter={props.onPressEnter} />,
                        )
                    }
                </Form.Item>
            );
        }
        return (
            <Form layout="vertical">
                <Form.Item label="크리덴셜 타입">
                    {
                        getFieldDecorator('type', {
                            initialValue: props.type,
                            rules: [{ required: true, message: 'Please select device type!' }],
                        })(
                            <Select placeholder="Please select a type" onChange={props.onChange}>
                                <Select.Option value="ACCESS_TOKEN">
                                    {'Access token'}
                                </Select.Option>
                                <Select.Option value="X509_CERTIFICATE">
                                    {'X.509 Certificate'}
                                </Select.Option>
                            </Select>,
                        )
                    }
                </Form.Item>
                {inputField}
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
    },
);

export default DeviceCredentialsForm;
