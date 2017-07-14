import React, { Component } from 'react';
import { Button } from 'antd';
import i18n from 'i18next';

import CommonModal from '../common/CommonModal';
import DeviceCredentialsForm from './DeviceCredentialsForm';

class DeviceCredentialsModal extends Component {

    state = {
        credentialsType: 'ACCESS_TOKEN',
        credentialsValue: '',
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            return true;
        }
        return false;
    }

    handleSelectChange = (value) => {
        this.setState({
            credentialsType: value,
            credentialsValue: '',
        });
    }

    changeValue = (data) => {
        let credentialsValue;
        const credentialsType = data.credentialsType;
        if (data.credentialsType === 'ACCESS_TOKEN') {
            credentialsValue = data.credentialsId;
        } else {
            credentialsValue = data.credentialsValue;
        }
        this.setState({
            credentialsType,
            credentialsValue,
        });
    }

    footerComponents = () => {
        const { authority } = this.props;
        if (!authority) {
            return (
                <Button key="back" size="large" onClick={this.props.onCancel}>
                    {i18n.t('action.cancel')}
                </Button>
            );
        }
    }

    render() {
        return (
            <CommonModal
                ref={(c) => { this.modal = c; }}
                title={i18n.t('device.device-credentials')}
                onOk={this.props.onSave}
                onCancel={this.props.onCancel}
                okText={i18n.t('action.save')}
                cancelText={i18n.t('action.cancel')}
                footer={this.footerComponents()}
            >
                <DeviceCredentialsForm
                    ref={(c) => { this.form = c; }}
                    onPressEnter={this.props.onSave}
                    onChange={this.handleSelectChange}
                    type={this.state.credentialsType}
                    value={this.state.credentialsValue}
                    disabled={!this.props.authority}
                />
            </CommonModal>
        );
    }
}

export default DeviceCredentialsModal;
