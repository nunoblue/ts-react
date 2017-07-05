import React, { Component } from 'react';

import CommonModal from '../common/CommonModal';
import DeviceForm from './DeviceForm';

class AddDeviceModal extends Component {

    render() {
        const { onSave, onCancel, options } = this.props;
        return (
            <CommonModal
            ref={(c) => { this.modal = c; }}
            title="디바이스 추가"
            onOk={onSave}
            onCancel={onCancel}
            okText="추가"
            cancelText="취소"
            >
                <DeviceForm
                    ref={(c) => { this.form = c; }}
                    onPressEnter={onSave}
                    options={options}
                />
            </CommonModal>
        );
    }
}

export default AddDeviceModal;
