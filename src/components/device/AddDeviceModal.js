import React, { Component } from 'react';

import CustomModal from '../common/CustomModal';
import AddDeviceForm from './AddDeviceForm';

class AddDeviceModal extends Component {

    render() {
        return (
            <CustomModal
            ref={(c) => { this.modal = c; }}
            title="디바이스 추가"
            onOk={this.props.onSave}
            onCancel={this.props.onCancel}
            okText="추가"
            cancelText="취소"
            >
                <AddDeviceForm ref={(c) => { this.form = c; }} onPressEnter={this.props.onSave} options={this.props.options} />
            </CustomModal>
        );
    }
}

export default AddDeviceModal;
