import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification } from 'antd';

import CustomButton from '../components/common/CustomButton';
import CustomCheckbox from '../components/common/CustomCheckbox';
import CustomCard from '../components/common/CustomCard';
import AddDeviceModal from '../components/device/AddDeviceModal';
import DeviceCredentialsModal from '../components/device/DeviceCredentialsModal';

import * as actions from '../actions/devices';

class Devices extends Component {
    state = {
        limit: 30,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
    }

    componentDidMount() {
        console.log('Devices Render');
        this.refershDeviceRequest(this.props.currentUser);
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const type = data.type;
            const id = data.id.id;
            const modalConfirmAction = this.handleDeleteConfirm.bind(this, name, id);
            const credentialsModal = this.openCredentials.bind(this, id);
            return (
                <CustomCard key={id} id={id} title={<CustomCheckbox value={id} onChange={this.handleChecked}>{name}</CustomCheckbox>} content={type.toUpperCase()}>
                    <CustomButton className="custom-card-button" iconClassName="user-add" tooltipTitle="asdf 공유" />
                    <CustomButton className="custom-card-button" iconClassName="tablet" tooltipTitle="커스터머 할당" />
                    <CustomButton className="custom-card-button" iconClassName="layout" onClick={credentialsModal} tooltipTitle="크리덴셜 관리" />
                    <CustomButton className="custom-card-button" iconClassName="delete" onClick={modalConfirmAction} tooltipTitle="디바이스 삭제" />
                </CustomCard>
            );
        });
        return components;
    }

    refershDeviceRequest = (currentUser) => {
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.setState({
            checkedIdArray: [],
            checkedCount: 0,
        });
        this.props.getDevicesRequest(limit, textSearch, currentUser);
        this.props.getDeviceTypesRequest();
    }

    handleChecked = (e) => {
        const checkedCount = this.state.checkedCount;
        const checkedIdArray = this.state.checkedIdArray;
        if (e.target.checked) {
            checkedIdArray.push(e.target.value);
            this.setState({
                checkedCount: checkedCount + 1,
                checkedIdArray,
            });
        } else {
            const pos = this.state.checkedIdArray.indexOf(e.target.value);
            checkedIdArray.splice(pos, 1);
            this.setState({
                checkedCount: checkedCount - 1,
                checkedIdArray,
            });
        }
    }

    handleDeleteConfirm = (title, id) => {
        const checkedCount = this.state.checkedCount;
        let newTitle;
        let newContent;
        let deleteEvent;
        if (checkedCount === 0) {
            newTitle = `'${title}' 디바이스를 삭제하시겠습니까?`;
            newContent = '디바이스 및 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleDeleteDevice.bind(this, id);
        } else {
            newTitle = `디바이스 ${checkedCount}개를 삭제하시겠습니까?`;
            newContent = '선택된 디바이스 삭제되고 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleMultipleDeleteDevice.bind(this, id);
        }
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: '예',
            cancelText: '아니오',
            onOk: deleteEvent,
        });
    }

    openAddDeviceModal = () => {
        this.addModal.modal.onShow();
    }

    hideAddDeviceModal = () => {
        this.addModal.form.resetFields();
        this.addModal.modal.onHide();
    }

    openCredentials = (id) => {
        this.props.getDeviceCredentialsRequest(id).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.credentialsModal.modal.onShow();
                this.credentialsModal.changeValue(this.props.credentials);
            }
        });
    }

    hideCredentials = () => {
        this.credentialsModal.form.resetFields();
        this.credentialsModal.modal.onHide();
    }

    handleDeleteDevice = (id) => {
        this.props.deleteDeviceRequest(id).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDeviceRequest();
            }
        });
    }

    handleMultipleDeleteDevice = () => {
        this.props.multipleDeleteDeviceRequest(this.state.checkedIdArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDeviceRequest();
            }
        });
    }

    handleSaveDevice = () => {
        const form = this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            this.props.saveDeviceRequest(values).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershDeviceRequest();
                    this.hideAddDeviceModal();
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    handleSaveCredentials = () => {
        const form = this.credentialsModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }

            let data;
            if (values.type === 'ACCESS_TOKEN') {
                data = {
                    credentialsType: values.type,
                    credentialsId: values.accessToken,
                    credentialsValue: null,
                };
            } else {
                data = {
                    credentialsType: values.type,
                    credentialsValue: values.rsaPublicKey,
                };
            }
            const credentials = $.extend(true, this.props.credentials, data);

            this.props.saveDeviceCredentialsRequest(credentials).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    // this.refershDeviceRequest();
                    this.hideCredentials();
                }
            });
        });
    }

    render() {
        const options = this.props.types.map((obj) => {
            return obj.type;
        });
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CustomButton
                    isUsed={this.state.checkedCount !== 0}
                    tooltipTitle={`디바이스 ${this.state.checkedCount}개 삭제`}
                    className="custom-card-button"
                    iconClassName="delete"
                    onClick={this.handleDeleteConfirm}
                    size="large"
                    />
                    <CustomButton tooltipTitle="디바이스 추가" className="custom-card-button" iconClassName="plus" onClick={this.openAddDeviceModal} size="large" />
                </div>
                <AddDeviceModal
                ref={(c) => { this.addModal = c; }}
                onSave={this.handleSaveDevice}
                onCancel={this.hideAddDeviceModal}
                options={options}
                />
                <DeviceCredentialsModal
                ref={(c) => { this.credentialsModal = c; }}
                onSave={this.handleSaveCredentials}
                onCancel={this.hideCredentials}
                />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.devices.statusMessage,
        data: state.devices.data,
        errorMessage: state.devices.errorMessage,
        types: state.devices.types,
        credentials: state.devices.credentials,
        currentUser: state.authentication.currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDevicesRequest: (limit, textSearch, currentUser) => {
            return dispatch(actions.getDevicesRequest(limit, textSearch, currentUser));
        },
        getDeviceTypesRequest: () => {
            return dispatch(actions.getDeviceTypesRequest());
        },
        getDeviceCredentialsRequest: (deviceId) => {
            return dispatch(actions.getDeviceCredentialsRequest(deviceId));
        },
        saveDeviceRequest: (device) => {
            return dispatch(actions.saveDeviceRequest(device));
        },
        deleteDeviceRequest: (deviceId) => {
            return dispatch(actions.deleteDeviceRequest(deviceId));
        },
        multipleDeleteDeviceRequest: (deviceIdArray) => {
            return dispatch(actions.multipleDeleteDeviceRequest(deviceIdArray));
        },
        saveDeviceCredentialsRequest: (credentials) => {
            return dispatch(actions.saveDeviceCredentialsRequest(credentials));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
