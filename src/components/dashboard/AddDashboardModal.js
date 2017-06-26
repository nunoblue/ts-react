import React, { Component } from 'react';

import CustomModal from '../common/CustomModal';
import AddDashboardForm from './AddDashboardForm';

class AddCustomerModal extends Component {

    handleCreate = () => {
        this.props.onCreate();
    }

    handleHideModal = () => {
        this.props.onHideModal();
    }

    render() {
        return (
            <CustomModal
            ref={(c) => { this.modal = c; }}
            title="대시보드 추가"
            onOk={this.handleCreate}
            onCancel={this.handleHideModal}
            okText="추가"
            cancelText="취소"
            >
                <AddDashboardForm ref={(c) => { this.form = c; }} onPressEnter={this.handleCreateDashboard} />
            </CustomModal>
        );
    }
}

export default AddCustomerModal;
