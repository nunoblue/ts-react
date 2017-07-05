import React, { Component } from 'react';
import { Button } from 'antd';

import CustomModal from '../common/CustomModal';
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
                    {"취소"}
                </Button>
            );
        }
    }

    render() {
        return (
            <CustomModal
            ref={(c) => { this.modal = c; }}
            title="디바이스 크리덴셜"
            onOk={this.props.onSave}
            onCancel={this.props.onCancel}
            okText="저장"
            cancelText="취소"
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
            </CustomModal>
        );
    }
}

export default DeviceCredentialsModal;