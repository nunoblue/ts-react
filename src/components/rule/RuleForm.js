import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder } from 'ts-antd-react-form-builder';
import _ from 'lodash';
import formUtil from '../../utils/formUtil';

@FormBuilder.create()
class RuleForm extends Component {
    static PropTypes = {
        rule: PropTypes.object,
        disabled: PropTypes.bool,
    }

    shouldComponentUpdate(nextProps, nextState){
        return (JSON.stringify(nextProps) !== JSON.stringify(this.props));
    }

    // handleChange = (e) => {
    //     if (typeof this.props.titleChangeEvent !== 'undefined') {
    //         this.props.titleChangeEvent(e.target.value);
    //     }
    // }

    render() {
        console.log('Render: RuleForm.js');
        const { disabled } = this.props;
        let basicSchema = [{
            type: 'hidden',
            name: 'id',
            },
            {
            type: 'text',
            name: 'name',
            disabled,
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
            },
            {
                type: 'textarea',
                name: 'description',
                label: '설명',
                disabled,
        }];

        if (_.has(this.props.rule, 'id')) {
            const { name, id: { id } } = this.props.rule;
            const description = this.props.rule.additionalInfo ? this.props.rule.additionalInfo.description : null;
            const basicInfo = {
                id,
                name,
                description,
            };
            basicSchema = formUtil.valuesToConfig(basicSchema, basicInfo);
        }

        return (
            <div>
                <FormBuilder
                    size="default"
                    hasFeedback
                    layout="horizontal"
                    config={basicSchema}
                />
            </div>
        );
    }
}

export default RuleForm;
