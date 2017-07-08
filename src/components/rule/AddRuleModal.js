import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import { Collapse, AutoComplete, Input, Icon, Select } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/CommonModal';
import RuleForm from './RuleForm';
import FilterContainer from './FilterContainer';

const Panel = Collapse.Panel;

class AddRuleModal extends Component {
    static propTypes = {
        rule: PropTypes.object,
    };

    state = {
        rule: this.props.rule,
        filters: [],
    };

    handleAutoCompleteChange = (value, label) => {
        console.log(value, label);
    }

    handlerFilter = {
        add: (filter) => {
            this.setState({
                filters: update(
                    this.state.list,
                    {
                        $push: [filter],
                    },
                ),
            });
        },
    };

    render() {
        const rule = this.props.rule;
        const isEdit = _.has(rule, 'id');

        const text = `
      A dog is a type of domesticated animal.
      Known for its loyalty and faithfulness,
      it can be found as a welcome guest in many households across the world.
  `;
        const dataSource = [{ key: '1', value: 'Burns Bay Road' }, { key: 2, value: 'Downing Street' }, { key: 3, value: 'Wall Street' }];
        const Option = Select.Option;
        const options = dataSource.map(d => <Option key={d.key}>{d.value}</Option>);

        return (
            <CommonModal
                ref={(c) => { this.modal = c; }}
                title={isEdit ? `${rule.name} 규칙 수정` : '규칙 추가'}
                onOk={this.props.onSave}
                onCancel={this.props.onCancel}
                okText={isEdit ? '수정' : '추가'}
                cancelText="취소"
            >
                <RuleForm
                    ref={(c) => { this.form = c; }}
                    rule={this.props.rule}
                    // onPressEnter={this.props.onSave}
                />

                <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                    <Panel header="필터" key="1">
                        <FilterContainer filters={this.props.rule.filters} />
                    </Panel>
                    <Panel header="프로세서" key="2">
                        <p>{text}</p>
                    </Panel>
                </Collapse>

                {/* <AutoComplete*/}
                {/* style={{ width: '100%' }}*/}
                {/* dataSource={dataSource}*/}
                {/* placeholder="플러그인 선택"*/}
                {/* allowClear={true}*/}
                {/* filterOption={(inputValue, option) =>*/}
                {/* option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}*/}
                {/* onChange={this.handleAutoCompleteChange}*/}
                {/* >*/}
                {/* </AutoComplete>*/}

                <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="플러그인 선택"
                    showArrow={false}
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    // onChange={this.handleChange}
                >
                    {options}
                </Select>

                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel header="플러그인 액션" key="1">
                        <p>{text}</p>
                    </Panel>
                </Collapse>

            </CommonModal>
        );
    }
}

export default AddRuleModal;
