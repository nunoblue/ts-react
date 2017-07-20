import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Modal, notification, Button } from 'antd';
import i18n from 'i18next';

import CommonButton from '../components/common/CommonButton';
import CommonCheckbox from '../components/common/CommonCheckbox';
import CommonCard from '../components/common/CommonCard';
import AddDeviceModal from '../components/device/AddDeviceModal';
import DeviceCredentialsModal from '../components/device/DeviceCredentialsModal';
import DetailDeviceDialog from '../components/device/DetailDeviceDialog';

import * as actions from '../actions/device/devices';
import * as customers from '../actions/customer/customers';
import * as telemetry from '../actions/telemetry/telemetry';

class Devices extends Component {

    static contextTypes = {
        currentUser: PropTypes.object,
        pageLoading: PropTypes.func,
    }

    state = {
        limit: 30,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
        authority: this.context.currentUser.authority === 'TENANT_ADMIN',
        isCustomer: typeof this.props.match.params.customerId === 'undefined',
        selectedDevice: null,
        dialogVisible: false,
    }

    componentDidMount() {
        console.log('Devices Render');
        this.refershDeviceRequest();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (nextState.selectedDevice !== this.state.selectedDevice) {
            return true;
        } else if (nextState.dialogVisible !== this.state.dialogVisible) {
            return true;
        } else if (nextProps.shortInfo === this.props.shortInfo) {
            return false;
        }
        return true;
    }

    componentWillUnmount() {
        const { subscribers } = this.props;
        if (Object.keys(subscribers).length !== 0) {
            this.props.unsubscribe(subscribers);
        }
    }

    buttonComponents = (name, deviceId, customerId) => {
        const { shortInfo, match } = this.props;
        const { currentUser } = this.context;
        const tenantCustomerId = currentUser.customerId.id;
        const isPublic = shortInfo[customerId] ? shortInfo[customerId].isPublic : undefined;
        const isAssign = tenantCustomerId !== customerId;
        let shareVisible;
        let assignVisible;
        let deleteVisible;
        if (this.state.authority) {
            if (match.params.customerId) {
                shareVisible = false;
                assignVisible = true;
                deleteVisible = false;
            } else {
                shareVisible = isPublic;
                assignVisible = !shareVisible;
                deleteVisible = true;
            }
        } else {
            shareVisible = false;
            assignVisible = false;
            deleteVisible = false;
        }
        const modalConfirmAction = this.handleDeleteConfirm.bind(this, name, deviceId);
        const credentialsModal = this.openCredentials.bind(this, deviceId);
        return (
            <Button.Group className="custom-card-buttongroup">
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={shareVisible}
                    iconClassName={isPublic ? 'cloud-download-o' : 'cloud-upload-o'}
                    tooltipTitle={isPublic ? i18n.t('device.make-private') : i18n.t('device.make-public')}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={assignVisible}
                    iconClassName={isAssign ? 'user-delete' : 'user-add'}
                    tooltipTitle={isAssign ? i18n.t('device.unassign-from-customer') : i18n.t('device.assign-to-customer')}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    iconClassName="key"
                    onClick={credentialsModal}
                    tooltipTitle={i18n.t('device.manage-credentials')}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={deleteVisible}
                    iconClassName="delete"
                    onClick={modalConfirmAction}
                    tooltipTitle={i18n.t('device.delete')}
                />
            </Button.Group>
        );
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const type = data.type;
            const id = data.id.id;
            const customerId = data.customerId.id;
            const openDialog = this.openDetailDialog.bind(this, id);
            const closeDialog = this.closeDetailDialog;
            return (
                <CommonCard
                    key={id}
                    style={{ cursor: 'pointer' }}
                    onSelfEvent={closeDialog}
                    onNextEvent={openDialog}
                    isCardDown={!this.state.dialogVisible}
                    title={<CommonCheckbox value={id} onChange={this.handleChecked}>{name}</CommonCheckbox>}
                    content={type.toUpperCase()}
                >
                    {this.buttonComponents(name, id, customerId)}
                </CommonCard>
            );
        });
        return components;
    }

    refershDeviceRequest = () => {
        this.context.pageLoading();
        const { match } = this.props;
        const { currentUser } = this.context;
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.setState({
            checkedIdArray: [],
            checkedCount: 0,
        });
        let authority;
        let customerId;
        if (this.state.authority) {
            customerId = match.params.customerId;
            authority = customerId ? 'CUSTOMER_USER' : currentUser.authority;
        } else {
            customerId = currentUser.customerId.id;
            authority = 'CUSTOMER_USER';
        }
        const customerIdArray = [];
        this.props.getDevicesRequest(limit, textSearch, authority, customerId).then(() => {
            if (this.props.statusMessage === 'FAILURE') {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
            this.props.data.map((data) => {
                if (customerIdArray.indexOf(data.customerId.id) === -1 && currentUser.customerId.id !== data.customerId.id) {
                    customerIdArray.push(data.customerId.id);
                }
            });
            this.props.getCustomerShortInfoRequest(customerIdArray);
            this.context.pageLoading();
        });

        this.props.getDeviceTypesRequest().then(() => {
            if (this.props.statusMessage !== 'SUCCESS') {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
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
        const newTitle = i18n.t('device.delete-device-title', { deviceName: title });
        const newContent = i18n.t('device.delete-device-text');
        const deleteEvent = this.handleDeleteDevice.bind(this, id);
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: i18n.t('action.yes'),
            cancelText: i18n.t('action.no'),
            onOk: deleteEvent,
        });
    }

    handleMultipleDeleteConfirm = () => {
        const checkedCount = this.state.checkedCount;
        const newTitle = i18n.t('device.delete-devices-title', { count: checkedCount });
        const newContent = i18n.t('device.delete-devices-text');
        const deleteEvent = this.handleMultipleDeleteDevice;
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: i18n.t('action.yes'),
            cancelText: i18n.t('action.no'),
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
        this.props.getDeviceCredentialsRequest(id).then((data) => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.credentialsModal.modal.onShow();
                this.credentialsModal.changeValue(data);
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    openAssignModal = () => {
        console.log('test');
    }

    hideCredentials = () => {
        this.credentialsModal.form.resetFields();
        this.credentialsModal.modal.onHide();
    }

    handleDeleteDevice = (id) => {
        this.props.deleteDeviceRequest(id).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDeviceRequest();
                this.closeDetailDialog();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleMultipleDeleteDevice = () => {
        this.props.multipleDeleteDeviceRequest(this.state.checkedIdArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDeviceRequest();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleSaveDevice = (type) => {
        const isDialog = type === 'dialog';
        const form = isDialog ? this.detailDialog.form : this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            const additionalInfo = {
                gateway: values.gateway,
                description: values.description,
            };
            delete values.gateway;
            delete values.description;
            const retValue = {};
            if (isDialog) {
                Object.assign(retValue, this.state.selectedDevice, values, { additionalInfo });
                this.setState({
                    selectedDevice: retValue,
                });
            } else {
                Object.assign(retValue, values, { additionalInfo });
            }
            this.props.saveDeviceRequest(retValue).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershDeviceRequest();
                    if (isDialog) {
                        this.openDetailDialog(retValue.id.id);
                    } else {
                        this.hideAddDeviceModal();
                    }
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
                    this.refershDeviceRequest();
                    this.hideCredentials();
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    subscribeForDeviceAttributes = (selectedDeviceId) => {
        const { isOpened, subscribers } = this.props;
        const clientScope = {
            entityType: 'DEVICE',
            entityId: selectedDeviceId,
            scope: 'CLIENT_SCOPE',
        };
        const latestTelemetryScope = {
            entityType: 'DEVICE',
            entityId: selectedDeviceId,
            scope: 'LATEST_TELEMETRY',
        };
        const attributeList = [clientScope, latestTelemetryScope];
        if (Object.keys(subscribers).length === 0) {
            this.props.subscribeForEntityAttributes(attributeList, isOpened);
        } else {
            this.props.unsubscribe(subscribers).then(() => {
                this.props.subscribeForEntityAttributes(attributeList, isOpened);
            });
        }
    }

    openDetailDialog = (selectedDeviceId) => {
        this.subscribeForDeviceAttributes(selectedDeviceId);
        this.detailDialog.clearEdit();
        const deviceData = this.loadDeviceDetailData(selectedDeviceId);
        this.detailDialog.initTitle(deviceData.name);
        let gateway;
        let description;
        if (deviceData.additionalInfo) {
            gateway = deviceData.additionalInfo.gateway || null;
            description = deviceData.additionalInfo.description || null;
        }
        this.detailDialog.form.setFieldsValue({
            name: deviceData.name,
            type: deviceData.type,
            description,
            gateway,
        });
        const customer = this.props.shortInfo[deviceData.customerId.id];
        const newDevice = Object.assign(deviceData, { assignedCustomer: customer });
        this.setState({
            dialogVisible: true,
            selectedDevice: newDevice,
        });
    }

    closeDetailDialog = () => {
        this.detailDialog.form.resetFields();
        this.setState({
            dialogVisible: false,
            selectedDevice: null,
        });
    }

    loadDeviceDetailData = (selectedDeviceId) => {
        const { data } = this.props;
        const deviceId = this.state.selectedDevice ? this.state.selectedDevice.id.id : null;
        let findDevice;
        if (selectedDeviceId === deviceId) {
            findDevice = this.state.selectedDevice;
            return findDevice;
        }
        data.some((device) => {
            if (device.id.id === selectedDeviceId) {
                findDevice = device;
                return true;
            }
            return false;
        });
        return findDevice;
    }

    render() {
        const options = this.props.types.map((obj) => {
            return obj.type;
        });
        const authority = this.state.authority === this.state.isCustomer;
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CommonButton
                        shape="circle"
                        tooltipTitle={i18n.t('device.assign-devices-text', { count: this.state.checkedCount })}
                        className={this.state.checkedCount !== 0 ? 'ts-action-button ts-action-button-fadeIn-1' : 'ts-action-button ts-action-button-fadeOut-1'}
                        iconClassName="user-add"
                        onClick={this.openAssignModal}
                        size="large"
                    />
                    <CommonButton
                        shape="circle"
                        tooltipTitle={i18n.t('device.delete-devices-action-title', { count: this.state.checkedCount })}
                        className={this.state.checkedCount !== 0 ? 'ts-action-button ts-action-button-fadeIn-2' : 'ts-action-button ts-action-button-fadeOut-2'}
                        iconClassName="delete"
                        onClick={this.handleMultipleDeleteConfirm}
                        size="large"
                    />
                    <CommonButton
                        shape="circle"
                        visible={this.state.isCustomer}
                        tooltipTitle={i18n.t('device.add-device-text')}
                        className="custom-card-button"
                        iconClassName="plus"
                        onClick={this.openAddDeviceModal}
                        size="large"
                    />
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
                    authority={authority}
                />
                <DetailDeviceDialog
                    ref={(c) => { this.detailDialog = c; }}
                    data={this.state.selectedDevice}
                    visible={this.state.dialogVisible}
                    options={options}
                    closeDialog={this.closeDetailDialog}
                    onSave={this.handleSaveDevice}
                    buttonComponents={this.buttonComponents}
                />
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    statusMessage: state.devices.statusMessage,
    data: state.devices.data,
    errorMessage: state.devices.errorMessage,
    types: state.devices.types,
    credentials: state.devices.credentials,
    shortInfo: state.customers.shortInfo,
    readyState: state.telemetry.readyState,
    lastCmdId: state.telemetry.lastCmdId,
    subscribers: state.telemetry.subscribers,
    isOpened: state.telemetry.isOpened,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getDevicesRequest: actions.getDevicesRequest,
    getDeviceTypesRequest: actions.getDeviceTypesRequest,
    getDeviceCredentialsRequest: actions.getDeviceCredentialsRequest,
    saveDeviceRequest: actions.saveDeviceRequest,
    deleteDeviceRequest: actions.deleteDeviceRequest,
    multipleDeleteDeviceRequest: actions.multipleDeleteDeviceRequest,
    saveDeviceCredentialsRequest: actions.saveDeviceCredentialsRequest,
    getCustomerShortInfoRequest: customers.getCustomerShortInfoRequest,
    subscribeForEntityAttributes: telemetry.subscribeForEntityAttributes,
    unsubscribe: telemetry.unsubscribe,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
