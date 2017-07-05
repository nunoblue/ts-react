import React, { Component } from 'react';
import { FormBuilder } from 'ts-antd-react-form-builder';
// import util from '../../utils/formUtil';

@FormBuilder.create()
class RuleForm extends Component {
    render() {
        const ruleSchema = [{
            type: 'text',
            name: 'name',
            rules: [
                {
                    required: true,
                    message: '이름을 입력하세요.',
                },
            ],
            formItemProps: {
                label: '이름',
                labelCol: { span: 0 },
                placeholder: '이름',
            },
            value: '',
        },
        {
            type: 'textarea',
            name: 'desc',
            label: '설명',
            value: '',
            placeholder: '설명',
        }];

        return (
            <div>
                <FormBuilder
                    size="default"
                    hasFeedback={true}
                    layout="horizontal"
                    config={ruleSchema}
                />
            </div>
        );
    }
}

export default RuleForm;
