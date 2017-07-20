import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Row, Modal, notification, Button } from 'antd';
import i18n from 'i18next';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';
import CommonCheckbox from '../components/common/CommonCheckbox';
import AddCustomerModal from '../components/customer/AddCustomerModal';
import DetailCustomerDialog from '../components/customer/DetailCustomerDialog';

import * as actions from '../actions/customer/customers';

class Customers extends Component {

    static contextTypes = {
        currentUser: PropTypes.object,
        pageLoading: PropTypes.func,
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

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (nextState.selectedCustomer !== this.state.selectedCustomer) {
            return true;
        } else if (nextState.dialogVisible !== this.state.dialogVisible) {
            return true;
        } else if (nextProps.data === this.props.data) {
            return false;
        }
        return true;
    }

    buttonComponents = (title, id, isPublic) => {
        const modalConfirmAction = this.handleDeleteConfirm.bind(this, title, id);
        return (
            <Button.Group className="custom-card-buttongroup">
                <Link to={`/customers/${id}/users`}>
                    <CommonButton
                        className="custom-card-button"
                        shape="circle"
                        visible={!isPublic}
                        iconClassName="user-add"
                        tooltipTitle={i18n.t('customer.manage-customer-users')}
                    />
                </Link>
                <Link to={`/customers/${id}/devices`}>
                    <CommonButton
                        className="custom-card-button"
                        shape="circle"
                        iconClassName="tablet"
                        tooltipTitle={i18n.t('customer.manage-customer-devices')}
                    />
                </Link>
                <Link to={`/customers/${id}/dashboards`}>
                    <CommonButton
                        className="custom-card-button"
                        shape="circle"
                        iconClassName="layout"
                        tooltipTitle={i18n.t('customer.manage-customer-dashboards')}
                    />
                </Link>
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={!isPublic}
                    iconClassName="delete"
                    onClick={modalConfirmAction}
                    tooltipTitle={i18n.t('customer.delete')}
                />
            </Button.Group>
        );
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const address = data.address || '';
            const id = data.id.id;
            const isPublic = data.additionalInfo ? (data.additionalInfo.isPublic || false) : false;
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
                    {this.buttonComponents(title, id, isPublic)}
                </CommonCard>
            );
        });
        return components;
    }

    refershCustomerRequest = () => {
        this.context.pageLoading();
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.setState({
            checkedIdArray: [],
            checkedCount: 0,
        });
        this.props.getCustomersRequest(limit, textSearch).then(() => {
            if (this.props.statusMessage === 'FAILURE') {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
            this.context.pageLoading();
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
        const newTitle = i18n.t('customer.delete-customer-title', { customerTitle: title });
        const newContent = i18n.t('customer.delete-customer-text');
        const deleteEvent = this.handleDeleteCustomer.bind(this, id);
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
        const newTitle = i18n.t('customer.delete-customers-title', { count: checkedCount });
        const newContent = i18n.t('customer.delete-customers-text');
        const deleteEvent = this.handleMultipleDeleteCustomer;
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: i18n.t('action.yes'),
            cancelText: i18n.t('action.no'),
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
                this.closeDetailDialog();
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
        const customerData = this.loadCustomerDetailData(selectedCustomerId);
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

    loadCustomerDetailData = (selectedCustomerId) => {
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
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CommonButton
                        visible={this.state.checkedCount !== 0}
                        shape="circle"
                        tooltipTitle={i18n.t('customer.delete-customers-action-title')}
                        className="custom-card-button"
                        iconClassName="delete"
                        onClick={this.handleMultipleDeleteConfirm}
                        size="large"
                    />
                    <CommonButton
                        tooltipTitle={i18n.t('customer.add')}
                        className="custom-card-button"
                        shape="circle"
                        iconClassName="plus"
                        onClick={this.openAddCustomerModal}
                        size="large"
                    />
                </div>
                <AddCustomerModal
                    ref={(c) => { this.addModal = c; }}
                    onSave={this.handleSaveCustomer}
                    onCancel={this.hideAddCustomerModal}
                />
                <DetailCustomerDialog
                    ref={(c) => { this.detailDialog = c; }}
                    data={this.state.selectedCustomer}
                    visible={this.state.dialogVisible}
                    closeDialog={this.closeDetailDialog}
                    onSave={this.handleSaveCustomer}
                    buttonComponents={this.buttonComponents}
                />
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    statusMessage: state.customers.statusMessage,
    data: state.customers.data,
    errorMessage: state.customers.errorMessage,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getCustomersRequest: actions.getCustomersRequest,
    saveCustomerRequest: actions.saveCustomerRequest,
    deleteCustomerRequest: actions.deleteCustomerRequest,
    multipleDeleteCustomerRequest: actions.multipleDeleteCustomerRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
