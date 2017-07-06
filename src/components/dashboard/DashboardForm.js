import React from 'react';
import { Form, Input, Radio } from 'antd';

const DashboardForm = Form.create()(
    (props) => {
        const { getFieldDecorator } = props.form;
        return (
            <Form layout="vertical">
                <Form.Item label="타이틀">
                    {
                        getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input the title of collection!' }],
                        })(
                            <Input onPressEnter={props.onPressEnter} />,
                        )
                    }
                </Form.Item>
                <Form.Item label="설명">
                    {getFieldDecorator('description')(<Input onPressEnter={props.onPressEnter} />)}
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

export default DashboardForm;
