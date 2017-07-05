import React, { Component } from 'react';
import CustomModal from '../common/CustomModal';
import RuleForm from './RuleForm';

class AddRuleModal extends Component {
    render() {
        return (
            <CustomModal
                ref={(c) => { this.modal = c; }}
                title="룰 추가"
                onOk={this.props.onSave}
                onCancel={this.props.onCancel}
                okText="추가"
                cancelText="취소"
            >
                <RuleForm
                    ref={(c) => { this.form = c; }}
                    // onPressEnter={this.props.onSave}
                />

            </CustomModal>
        );
    }
}

export default AddRuleModal;
