import React, { Component } from 'react';

import CustomModal from '../common/CustomModal';
import AddDashboardForm from './AddDashboardForm';

class AddCustomerModal extends Component {

    render() {
        return (
            <CustomModal
            ref={(c) => { this.modal = c; }}
            title="대시보드 추가"
            onOk={this.props.onSave}
            onCancel={this.props.onCancel}
            okText="추가"
            cancelText="취소"
            >
                <AddDashboardForm ref={(c) => { this.form = c; }} onPressEnter={this.props.onSave} />
            </CustomModal>
        );
    }
}

export default AddCustomerModal;
