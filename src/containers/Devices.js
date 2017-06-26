import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification } from 'antd';

import CustomButton from '../components/common/CustomButton';
import CustomModal from '../components/common/CustomModal';
import CustomCheckbox from '../components/common/CustomCheckbox';
import CustomCard from '../components/common/CustomCard';
import AddDeviceForm from '../components/device/AddDeviceForm';
import AddDeviceModal from '../components/device/AddDeviceModal';

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
        this.refershDeviceRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const type = data.type;
            const id = data.id.id;
            const modalConfirmAction = this.handleDeleteConfirm.bind(this, name, id);
            return (
                <CustomCard key={id} id={id} title={<CustomCheckbox value={id} onChange={this.handleChecked}>{name}</CustomCheckbox>} content={type}>
                    <CustomButton className="custom-card-button" iconClassName="user-add" tooltipTitle="디바이스 공유" />
                    <CustomButton className="custom-card-button" iconClassName="tablet" tooltipTitle="커스터머 할당" />
                    <CustomButton className="custom-card-button" iconClassName="layout" tooltipTitle="크리덴셜 관리" />
                    <CustomButton className="custom-card-button" iconClassName="delete" onClick={modalConfirmAction} tooltipTitle="디바이스 삭제" />
                </CustomCard>
            );
        });

        return components;
    }

    refershDeviceRequest = () => {
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.setState({
            checkedIdArray: [],
            checkedCount: 0,
        });
        this.props.getDevicesRequest(limit, textSearch);
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

    openCreateDevice = () => {
        this.createModal.modal.onShow();
    }

    openModifyDevice = (title, id) => {
        this.modifyModal.onShow();
        this.modifyForm.setFieldsValue({
            title,
        });
    }

    hideCreateDevice = () => {
        this.createModal.form.resetFields();
        this.createModal.modal.onHide();
    }

    hideModifyDevice = () => {
        this.modifyForm.resetFields();
        this.modifyModal.onHide();
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

    handleCreateDevice = () => {
        const form = this.createModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            this.props.saveDeviceRequest(values).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershDeviceRequest();
                    form.resetFields();
                    this.createModal.modal.onHide();
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    handleModifyDevice = () => {
        const modifyForm = this.modifyForm;
        modifyForm.validateFields((err, values) => {
            if (err) {
                return false;
            }
            this.props.saveDeviceRequest(values).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershDeviceRequest();
                    modifyForm.resetFields();
                    this.modifyModal.onHide();
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
                    className="custom-card-button" iconClassName="delete"
                    onClick={this.handleDeleteConfirm}
                    size="large"
                    />
                    <CustomButton tooltipTitle="디바이스 추가" className="custom-card-button" iconClassName="plus" onClick={this.openCreateDevice} size="large" />
                </div>
                <AddDeviceModal ref={(c) => { this.createModal = c; }} onCreate={this.handleCreateDevice} onHideModal={this.hideCreateDevice} options={options} />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDevicesRequest: (limit, textSearch) => {
            return dispatch(actions.getDevicesRequest(limit, textSearch));
        },
        getDeviceTypesRequest: () => {
            return dispatch(actions.getDeviceTypesRequest());
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
