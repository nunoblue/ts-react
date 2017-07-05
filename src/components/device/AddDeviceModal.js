import React, { Component } from 'react';

import CommonModal from '../common/CommonModal';
import DeviceForm from './DeviceForm';

class AddDeviceModal extends Component {

    render() {
        return (
            <CommonModal
            ref={(c) => { this.modal = c; }}
            title="디바이스 추가"
            onOk={this.props.onSave}
            onCancel={this.props.onCancel}
            okText="추가"
            cancelText="취소"
            >
                <DeviceForm ref={(c) => { this.form = c; }} onPressEnter={this.props.onSave} options={this.props.options} />
            </CommonModal>
        );
    }
}

export default AddDeviceModal;
