import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Modal, notification } from 'antd';
import { translate } from 'react-i18next';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';
import CommonCheckbox from '../components/common/CommonCheckbox';
import AddCustomerModal from '../components/customer/AddCustomerModal';
import DetailCustomerDialog from '../components/customer/DetailCustomerDialog';

import * as actions from '../actions/customers';

@translate(['customer', 'attribute', 'details', 'action'], { wait: false })
class Customers extends Component {

    static contextTypes = {
        currentUser: PropTypes.object,
    }

    state = {
        limit: 40,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
        selectedCustomer: null,
        dialogVisible: false,
    };

    componentDidMount() {
        console.log('Customers Render');
        this.refershCustomerRequest();
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (prevState.selectedCustomer !== this.state.selectedCustomer) {
            return true;
        } else if (prevState.dialogVisible !== this.state.dialogVisible) {
            return true;
        } else if (prevProps.data === this.props.data) {
            return false;
        }
        return true;
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const address = data.address || '';
            const id = data.id.id;
            const isPublic = data.additionalInfo ? (data.additionalInfo.isPublic || false) : false;
            const modalConfirmAction = this.handleDeleteConfirm.bind(this, title, id);
            const openDialog = this.openDetailDialog.bind(this, id);
            const closeDialog = this.closeDetailDialog;
            return (
                <CommonCard
                    key={id}
                    style={{ cursor: 'pointer' }}
                    title={<CommonCheckbox value={id} onChange={this.handleChecked}>{title}</CommonCheckbox>}
                    content={address}
                    onSelfEvent={closeDialog}
                    onNextEvent={openDialog}
                >
                    <Link to={`/customers/${id}/users`}>
                        <CommonButton
                            className="custom-card-button"
                            shape="circle"
                            visible={!isPublic}
                            iconClassName="user-add"
                            tooltipTitle="커스터머 사용자 관리"
                        />
                    </Link>
                    <Link to={`/customers/${id}/devices`}>
                        <CommonButton
                            className="custom-card-button"
                            shape="circle"
                            iconClassName="tablet"
                            tooltipTitle="커스터머 디바이스 관리"
                        />
                    </Link>
                    <Link to={`/customers/${id}/dashboards`}>
                        <CommonButton
                            className="custom-card-button"
                            shape="circle"
                            iconClassName="layout"
                            tooltipTitle="커스터머 대시보드 관리"
                        />
                    </Link>
                    <CommonButton
                        className="custom-card-button"
                        shape="circle"
                        visible={!isPublic}
                        iconClassName="delete"
                        onClick={modalConfirmAction}
                        tooltipTitle="커스터머 디바이스 삭제"
                    />
                </CommonCard>
            );
        });
        return components;
    }

    refershCustomerRequest = () => {
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.setState({
            checkedIdArray: [],
            checkedCount: 0,
        });
        this.props.getCustomersRequest(limit, textSearch).then(() => {
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
        const newTitle = `'${title}' 커스터머를 삭제하시겠습니까?`;
        const newContent = '커스터머 및 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
        const deleteEvent = this.handleDeleteCustomer.bind(this, id);
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: '예',
            cancelText: '아니오',
            onOk: deleteEvent,
        });
    }

    handleMultipleDeleteConfirm = () => {
        const checkedCount = this.state.checkedCount;
        const newTitle = `커스터머 ${checkedCount}개를 삭제하시겠습니까?`;
        const newContent = '선택된 커스터머는 삭제되고 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
        const deleteEvent = this.handleMultipleDeleteCustomer;
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: '예',
            cancelText: '아니오',
            onOk: deleteEvent,
        });
    }

    openAddCustomerModal = () => {
        this.addModal.modal.onShow();
    }

    hideAddCustomerModal = () => {
        this.addModal.form.resetFields();
        this.addModal.modal.onHide();
    }

    handleDeleteCustomer = (customerId) => {
        this.props.deleteCustomerRequest(customerId).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershCustomerRequest();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleMultipleDeleteCustomer = () => {
        this.props.multipleDeleteCustomerRequest(this.state.checkedIdArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershCustomerRequest();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleSaveCustomer = (type) => {
        const isDialog = type === 'dialog';
        const form = isDialog ? this.detailDialog.form : this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            const additionalInfo = {
                description: values.description,
            };
            delete values.description;
            const retValue = {};
            if (isDialog) {
                Object.assign(retValue, this.state.selectedCustomer, values, { additionalInfo });
                this.setState({
                    selectedCustomer: retValue,
                });
            } else {
                Object.assign(retValue, values, { additionalInfo });
            }
            this.props.saveCustomerRequest(retValue).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershCustomerRequest();
                    if (isDialog) {
                        this.openDetailDialog(this.state.selectedCustomer.id.id);
                    } else {
                        this.hideAddCustomerModal();
                    }
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    openDetailDialog = (selectedCustomerId) => {
        this.detailDialog.clearEdit();
        const customerData = this.loadDeviceDetailData(selectedCustomerId);
        this.detailDialog.initTitle(customerData.title);
        let description;
        if (customerData.additionalInfo) {
            description = customerData.additionalInfo.description || null;
        }
        this.detailDialog.form.setFieldsValue({
            title: customerData.title,
            description,
        });
        this.setState({
            dialogVisible: true,
            selectedCustomer: customerData,
        });
    }

    closeDetailDialog = () => {
        this.detailDialog.form.resetFields();
        this.setState({
            dialogVisible: false,
            selectedDevice: null,
        });
    }

    loadDeviceDetailData = (selectedCustomerId) => {
        const { data } = this.props;
        const customerId = this.state.selectedCustomer ? this.state.selectedCustomer.id.id : null;
        let findCustomer;
        if (selectedCustomerId === customerId) {
            findCustomer = this.state.selectedCustomer;
            return findCustomer;
        }
        data.some((customer) => {
            if (customer.id.id === selectedCustomerId) {
                findCustomer = customer;
                return true;
            }
            return false;
        });
        return findCustomer;
    }

    render() {
        const { t } = this.props;
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CommonButton
                        visible={this.state.checkedCount !== 0}
                        tooltipTitle={`커스터머 ${this.state.checkedCount}개 삭제`}
                        className="custom-card-button"
                        iconClassName="delete"
                        onClick={this.handleDeleteConfirm}
                        size="large"
                    />
                    <CommonButton tooltipTitle="커스터머 추가" className="custom-card-button" shape="circle" iconClassName="plus" onClick={this.openAddCustomerModal} size="large" />
                </div>
                <AddCustomerModal ref={(c) => { this.addModal = c; }} onSave={this.handleSaveCustomer} onCancel={this.hideAddCustomerModal} />
                <DetailCustomerDialog
                    ref={(c) => { this.detailDialog = c; }}
                    t={t}
                    customerId={this.state.selectedCustomer ? this.state.selectedCustomer.id.id : null}
                    isPublic={this.state.selectedCustomer ? this.state.selectedCustomer.additionalInfo.isPublic : null}
                    visible={this.state.dialogVisible}
                    closeDialog={this.closeDetailDialog}
                    onSave={this.handleSaveCustomer}
                />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.customers.statusMessage,
        data: state.customers.data,
        errorMessage: state.customers.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCustomersRequest: (limit, textSearch) => {
            return dispatch(actions.getCustomersRequest(limit, textSearch));
        },
        saveCustomerRequest: (customer) => {
            return dispatch(actions.saveCustomerRequest(customer));
        },
        deleteCustomerRequest: (customerId) => {
            return dispatch(actions.deleteCustomerRequest(customerId));
        },
        multipleDeleteCustomerRequest: (customerIdArray) => {
            return dispatch(actions.multipleDeleteCustomerRequest(customerIdArray));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
