import React, { Component } from 'react';
import CommonModal from '../common/CommonModal';
import RuleForm from './RuleForm';
import FilterList from './FilterList';
import update from 'react-addons-update';

const Panel = Collapse.Panel;

class AddRuleModal extends Component {
    render() {
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
                        <FilterList filters={this.props.rule.filters} />
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

            </CustomModal>
            </CommonModal>
        );
    }
}

export default AddRuleModal;
