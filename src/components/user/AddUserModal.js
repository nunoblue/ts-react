import React, { Component } from 'react';

import CustomModal from '../common/CustomModal';
import AddUserForm from './AddUserForm';

class AddUserModal extends Component {

    render() {
        return (
            <CustomModal
            ref={(c) => { this.modal = c; }}
            title="유저 추가"
            onOk={this.props.onSave}
            onCancel={this.props.onCancel}
            okText="추가"
            cancelText="취소"
            >
                <AddUserForm ref={(c) => { this.form = c; }} onPressEnter={this.props.onSave} />
            </CustomModal>
        );
    }
}

export default AddUserModal;
