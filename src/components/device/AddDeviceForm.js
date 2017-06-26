import React from 'react';
import { Form, Input, Select, Option } from 'antd';

const AddDeviceForm = Form.create()(
    (props) => {
        const { getFieldDecorator } = props.form;
        return (
            <Form layout="vertical">
                <Form.Item label="이름">
                    {
                        getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input the title of collection!' }],
                        })(
                            <Input onPressEnter={props.onPressEnter} />,
                        )
                    }
                </Form.Item>
                <Form.Item label="디바이스 타입">
                    {
                        getFieldDecorator('type', {
                            rules: [{ required: true, message: 'Please select device type!' }],
                        })(
                            <Select placeholder="Please select a type">
                                {props.options.map((option) => {
                                    return <Select.Option key={option} value={option}>{option}</Select.Option>;
                                })}
                            </Select>,
                        )
                    }
                </Form.Item>
                <Form.Item label="설명">
                    {
                        getFieldDecorator('description')(
                            <Input onPressEnter={props.onPressEnter} />,
                        )
                    }
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
    },
);

export default AddDeviceForm;
