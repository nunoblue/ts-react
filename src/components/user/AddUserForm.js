import React from 'react';
import { Form, Input, Checkbox, Select } from 'antd';

const AddUserForm = Form.create()(
    (props) => {
        const { getFieldDecorator } = props.form;
        return (
            <Form layout="vertical">
                <Form.Item label="Email">
                    {
                        getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input the email of collection!' }],
                        })(
                            <Input onPressEnter={props.onPressEnter} />,
                        )
                    }
                </Form.Item>
                <Form.Item label="이름">
                    {getFieldDecorator('firstName')(<Input onPressEnter={props.onPressEnter} />)}
                </Form.Item>
                <Form.Item label="성">
                    {getFieldDecorator('lastName')(<Input onPressEnter={props.onPressEnter} />)}
                </Form.Item>
                <Form.Item label="설명">
                    {getFieldDecorator('description')(<Input onPressEnter={props.onPressEnter} />)}
                </Form.Item>
                <Form.Item label="기본 대시보드">
                    {
                        getFieldDecorator('defaultDashboardFullscreen', {
                            valuePropName: 'checked',
                            initialValue: false,
                        })(
                            <Checkbox>{'항상 전체화면'}</Checkbox>,
                        )
                    }
                </Form.Item>
                {/*<Form.Item label="도">
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

export default AddUserForm;
