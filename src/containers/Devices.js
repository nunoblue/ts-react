import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Modal, notification, Button } from 'antd';
import { translate } from 'react-i18next';

import CommonButton from '../components/common/CommonButton';
import CommonCheckbox from '../components/common/CommonCheckbox';
import CommonCard from '../components/common/CommonCard';
import AddDeviceModal from '../components/device/AddDeviceModal';
import DeviceCredentialsModal from '../components/device/DeviceCredentialsModal';

import * as actions from '../actions/devices';
import * as customers from '../actions/customers';

@translate(['device'], { wait: false })
class Devices extends Component {

    static contextTypes = {
        currentUser: PropTypes.object,
    }

    state = {
        limit: 30,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
        authority: this.context.currentUser.authority === 'TENANT_ADMIN',
        isCustomer: typeof this.props.match.params.customerId === 'undefined',
    }

    componentDidMount() {
        console.log('Devices Render');
        this.refershDeviceRequest();
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (prevProps.shortInfo === this.props.shortInfo) {
            return false;
        }
        return true;
    }

    buttonComponents = (deviceId, customerId) => {
        const { shortInfo, match, t } = this.props;
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
                    tooltipTitle={isPublic ? '디바이스 공유 해제' : '디바이스 공유'}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={assignVisible}
                    iconClassName={isAssign ? 'user-delete' : 'user-add'}
                    tooltipTitle={isAssign ? '커스터머 해제' : '커스터머 할당'}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    iconClassName="key"
                    onClick={credentialsModal}
                    tooltipTitle="크리덴셜 관리"
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={deleteVisible}
                    iconClassName="delete"
                    onClick={modalConfirmAction}
                    tooltipTitle={t('device.delete')}
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
            return (
                <CommonCard
                    key={id}
                    style={{ cursor: 'pointer' }}
                    id={id}
                    title={<CommonCheckbox value={id} onChange={this.handleChecked}>{name}</CommonCheckbox>}
                    content={type.toUpperCase()}
                >
                    {this.buttonComponents(id, customerId)}
                </CommonCard>
            );
        });
        return components;
    }

    refershDeviceRequest = () => {
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
            if (this.props.statusMessage !== 'SUCCESS') {
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
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
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
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    render() {
        const { t } = this.props;
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
                        visible={this.state.checkedCount !== 0}
                        tooltipTitle={`디바이스 ${this.state.checkedCount}개 삭제`}
                        className="custom-card-button"
                        iconClassName="delete"
                        onClick={this.handleDeleteConfirm}
                        size="large"
                    />
                    <CommonButton
                        shape="circle"
                        visible={this.state.isCustomer}
                        tooltipTitle={t('device.add-device-text')}
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
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
