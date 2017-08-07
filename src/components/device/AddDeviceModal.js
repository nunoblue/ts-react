import React, { Component } from 'react';
import i18n from 'i18next';

import CommonModal from '../common/CommonModal';
import DeviceForm from './DeviceForm';

class AddDeviceModal extends Component {

    render() {
        const { onSave, onCancel, options } = this.props;
        return (
            <CommonModal
                className={'ts-modal'}
                ref={(c) => { this.modal = c; }}
                title={i18n.t('device.add-device-text')}
                onOk={onSave}
                onCancel={onCancel}
                okText={i18n.t('action.add')}
                cancelText={i18n.t('action.cancel')}
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
