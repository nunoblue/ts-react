import React, { Component } from 'react';

import CustomModal from '../common/CustomModal';
import AddCustomerForm from './AddCustomerForm';

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
            title="커스터머 추가"
            onOk={this.handleCreate}
            onCancel={this.handleHideModal}
            okText="추가"
            cancelText="취소"
            >
                <AddCustomerForm ref={(c) => { this.form = c; }} onPressEnter={this.handleCreate} />
            </CustomModal>
        );
    }
}

export default AddCustomerModal;
