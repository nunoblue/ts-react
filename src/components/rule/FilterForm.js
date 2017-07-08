import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Select, Row, Col } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;

class SourceForm extends Component {
    static propTypes = {
        filters: PropTypes.array,
    };

    state = {
        filter: {},
    };

    properties = () => {
        const filter = this.state.filter;
        if (!_.isEmpty(filter)) {
            const { schema, form } = filter.configurationDescriptor;
        }
        return (filter.name);
    };

    handleChange = (clazz) => {
        const filter = this.props.filters.find(item => item.clazz === clazz);
        this.setState({
           filter,
        });
    };



    render() {
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        const options = this.props.filters.map(filter => <Option key={filter.clazz}>{filter.name}</Option>);
        return (
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <FormItem label="이름">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '이름을 입력하세요', whitespace: true }],
                            })(
                                <Input />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="종류">
                            {getFieldDecorator('clazz', {
                                rules: [{ required: true, message: '종류를 입력하세요.'}],
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="필터 선택"
                                    showArrow
                                    onChange={this.handleChange}
                                >
                                    {options}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        { this.properties() }
                    </Col>
                </Row>
            </Form>
        );
    }
};

const FilterForm = Form.create()(SourceForm);

export default FilterForm;
