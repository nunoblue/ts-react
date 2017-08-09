import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Row, Modal, notification, Button, Col } from 'antd';
import i18n from 'i18next';

import CommonButton from '../components/common/CommonButton';
import CommonCheckbox from '../components/common/CommonCheckbox';
import CommonCard from '../components/common/CommonCard';
import CreateCard from '../components/common/CreateCard';
import AddDashboardModal from '../components/dashboard/AddDashboardModal';
import DetailDashboardDialog from '../components/dashboard/DetailDashboardDialog';
import ItemSelectModal from '../components/common/ItemSelectModal';

import * as actions from '../actions/dashboard/dashboards';
import * as customers from '../actions/customer/customers';
import { urlConstants } from '../services/constants';
import config from '../configs';

class Dashboards extends Component {

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
        selectedDashboard: null,
        dialogVisible: false,
    }

    componentDidMount() {
        console.log('Dashboards Render');
        this.refershDashboardRequest();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (nextState.selectedDashboard !== this.state.selectedDashboard) {
            return true;
        } else if (nextState.dialogVisible !== this.state.dialogVisible) {
            return true;
        } else if (nextProps.shortInfo === this.props.shortInfo) {
            return false;
        }
        return true;
    }

    componentWillUnmount() {
        const { clearDashboardsRequest } = this.props;
        clearDashboardsRequest();
    }

    buttonComponents = (title, dashboardId, customerId) => {
        const { shortInfo, match } = this.props;
        const { currentUser } = this.context;
        const tenantCustomerId = currentUser.customerId.id;
        const isPublic = shortInfo[customerId] ? shortInfo[customerId].isPublic : undefined;
        const isAssign = tenantCustomerId !== customerId;
        let shareVisible;
        let assignVisible;
        let deleteVisible;
        let linkButton = (
            <Link to={`/dashboards/${dashboardId}`}>
                <CommonButton
                    className="ts-card-button"
                    shape="circle"
                    iconClassName="search"
                    tooltipTitle={i18n.t('dashboard.dashboard-details')}
                />
            </Link>
        );
        if (this.state.authority) {
            if (match.params.customerId) {
                shareVisible = false;
                assignVisible = true;
                deleteVisible = false;
                linkButton = (
                    <Link to={`/customers/${match.params.customerId}/dashboards/${dashboardId}`}>
                        <CommonButton
                            className="ts-card-button"
                            shape="circle"
                            iconClassName="search"
                            tooltipTitle={i18n.t('dashboard.dashboard-details')}
                        />
                    </Link>
                );
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

        const modalConfirmAction = this.handleDeleteConfirm.bind(this, title, dashboardId);
        return (
            <Button.Group className="ts-card-buttongroup">
                {linkButton}
                <CommonButton
                    className="ts-card-button"
                    shape="circle"
                    visible={this.state.authority}
                    iconClassName="export"
                    tooltipTitle={i18n.t('dashboard.export')}
                />
                {
                    shareVisible ? (
                        <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                            <div className="ts-modal-button">
                                <CommonButton
                                    className="ts-card-button"
                                    shape="circle"
                                    visible={shareVisible}
                                    iconClassName={isPublic ? 'cloud-download-o' : 'cloud-upload-o'}
                                    tooltipTitle={isPublic ? i18n.t('dashboard.make-private') : i18n.t('dashboard.make-public')}
                                />
                            </div>
                        </Col>
                    ) : null
                }
                {
                    assignVisible ? (
                        <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                            <div className="ts-modal-button">
                                <CommonButton
                                    className="ts-card-button"
                                    shape="circle"
                                    visible={assignVisible}
                                    iconClassName={isAssign ? 'user-delete' : 'user-add'}
                                    tooltipTitle={isAssign ? i18n.t('dashboard.unassign-from-customer') : i18n.t('dashboard.assign-to-customer')}
                                />
                            </div>
                        </Col>
                    ) : null
                }
                <CommonButton
                    className="ts-card-button"
                    shape="circle"
                    visible={deleteVisible}
                    iconClassName="delete"
                    onClick={modalConfirmAction}
                    tooltipTitle={i18n.t('dashboard.delete')}
                />
            </Button.Group>
        );
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const id = data.id.id;
            const customerId = data.customerId.id;
            const openDialog = this.openDetailDialog.bind(this, id);
            const closeDialog = this.closeDetailDialog;
            return (
                <CommonCard
                    key={id}
                    title={title}
                    onSelfEvent={closeDialog}
                    onNextEvent={openDialog}
                    isCardDown={!this.state.dialogVisible}
                >
                    <CommonCheckbox checkedCount={this.state.checkedCount} value={id} onChange={this.handleChecked}>{title}</CommonCheckbox>
                    {this.buttonComponents(title, id, customerId)}
                </CommonCard>
            );
        });
        return components;
    }

    refershDashboardRequest = () => {
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
        this.props.getDashboardsRequest(limit, textSearch, authority, customerId).then(() => {
            if (this.props.statusMessage === 'FAILURE') {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
            if (this.props.statusMessage === 'SUCCESS') {
                this.props.data.map((data) => {
                    if (customerIdArray.indexOf(data.customerId.id) === -1 && currentUser.customerId.id !== data.customerId.id) {
                        customerIdArray.push(data.customerId.id);
                    }
                });
                this.props.getCustomerShortInfoRequest(customerIdArray);
                this.context.pageLoading();
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
        const newTitle = i18n.t('dashboard.delete-dashboard-title', { dashboardTitle: title });
        const newContent = i18n.t('dashboard.delete-dashboard-text');
        const deleteEvent = this.handleDeleteDashboard.bind(this, id);
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
        const newTitle = i18n.t('dashboard.delete-dashboards-title', { count: checkedCount });
        const newContent = i18n.t('dashboard.delete-dashboards-text');
        const deleteEvent = this.handleMultipleDeleteDashboard;
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: '예',
            cancelText: '아니오',
            onOk: deleteEvent,
        });
    }

    openAddDashboardModal = () => {
        this.addModal.modal.onShow();
    }

    hideAddDashboardModal = () => {
        this.addModal.form.resetFields();
        this.addModal.modal.onHide();
    }

    handleDeleteDashboard = (dashboardId) => {
        this.props.deleteDashboardRequest(dashboardId).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDashboardRequest();
                this.closeDetailDialog();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleMultipleDeleteDashboard = () => {
        this.props.multipleDeleteDashboardRequest(this.state.checkedIdArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDashboardRequest();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleSaveDashboard = (type) => {
        const isDialog = type === 'dialog';
        const form = isDialog ? this.detailDialog.form : this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            const configuration = {
                description: values.description,
            };
            delete values.description;
            const retValue = {};
            if (isDialog) {
                Object.assign(retValue, this.state.selectedDashboard, values, { configuration });
                this.setState({
                    selectedDashboard: retValue,
                });
            } else {
                Object.assign(retValue, values, { configuration });
            }
            this.props.saveDashboardRequest(retValue).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershDashboardRequest();
                    if (isDialog) {
                        this.openDetailDialog(retValue.id.id);
                    } else {
                        this.hideAddDashboardModal();
                    }
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    };

    assignDashboardModalHandler = {
        show: () => {
            this.assignDashboardModal.onShow();
        },
        hide: () => {
            this.assignDashboardModal.onHide();
        },
    };

    handleSelectDevice = (selectedIds) => {
        const customerId = this.props.match.params.customerId;
        this.props.multipleAssignDashboardToCustomer(customerId, selectedIds).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDashboardRequest();
                this.assignDashboardModalHandler.hide();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    };

    openDetailDialog = (selectedId) => {
        const { shortInfo } = this.props;
        this.detailDialog.clearEdit();
        const dashboardData = this.loadDashboardDetailData(selectedId);
        if (dashboardData instanceof Promise) {
            dashboardData.then((data) => {
                const customer = shortInfo[data.customerId.id];
                Object.assign(data, { customer });
                this.settingDetailDialog(data);
            });
        } else {
            const customer = shortInfo[dashboardData.customerId.id];
            Object.assign(dashboardData, { customer });
            this.settingDetailDialog(dashboardData);
        }
    }

    settingDetailDialog = (data) => {
        this.detailDialog.initTitle(data.title);
        let description;
        if (data.configuration) {
            description = data.configuration.description || null;
        }
        this.detailDialog.form.setFieldsValue({
            title: data.title,
            description,
        });
        this.setState({
            dialogVisible: true,
            selectedDashboard: data,
        });
    }

    closeDetailDialog = () => {
        this.detailDialog.form.resetFields();
        this.setState({
            dialogVisible: false,
            selectedDashboard: null,
        });
    }

    loadDashboardDetailData = (selectedId) => {
        const { getDashboardRequest } = this.props;
        const id = this.state.selectedDashboard ? this.state.selectedDashboard.id.id : null;
        let findData;
        if (selectedId === id) {
            findData = this.state.selectedDashboard;
            return findData;
        }
        return getDashboardRequest(selectedId).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                findData = this.props.dashboard;
                return findData;
            }
            notification.error({
                message: this.props.errorMessage,
            });
        });
    }

    render() {
        const authority = this.state.authority === this.state.isCustomer;
        return (
            <Row>
                {
                    authority ? (
                        <CreateCard onClick={this.openAddDeviceModal} type={'dashboard'} />
                    ) : null
                }
                {this.components()}
                <div className="footer-buttons">
                    <CommonButton
                        shape="circle"
                        visible={this.state.checkedCount !== 0}
                        tooltipTitle={i18n.t('dashboard.delete-dashboards-action-title', { count: this.state.checkedCount })}
                        className="ts-card-button"
                        iconClassName="delete"
                        onClick={this.handleMultipleDeleteConfirm}
                        size="large"
                    />
                    <CommonButton
                        shape="circle"
                        visible={this.state.isCustomer}
                        tooltipTitle={i18n.t('dashboard.add-dashboard-text')}
                        className="ts-card-button"
                        iconClassName="plus"
                        onClick={this.openAddDashboardModal}
                        size="large"
                    />
                    <CommonButton
                        shape="circle"
                        visible={!this.state.isCustomer}
                        tooltipTitle={i18n.t('dashboard.assign-new-dashboard')}
                        className="ts-card-button"
                        iconClassName="plus"
                        onClick={this.assignDashboardModalHandler.show}
                        size="large"
                    />
                </div>
                <AddDashboardModal
                    ref={(c) => { this.addModal = c; }}
                    onSave={this.handleSaveDashboard}
                    onCancel={this.hideAddDashboardModal}
                />
                <DetailDashboardDialog
                    ref={(c) => { this.detailDialog = c; }}
                    data={this.state.selectedDashboard}
                    visible={this.state.dialogVisible}
                    closeDialog={this.closeDetailDialog}
                    onSave={this.handleSaveDashboard}
                    buttonComponents={this.buttonComponents}
                />
                <ItemSelectModal
                    ref={(c) => { this.assignDashboardModal = c; }}
                    url={`${config.apServer}${urlConstants.DASHBOARDS.TENANT_DASHBOARDS_URL}`}
                    multiple
                    labelField={'title'}
                    valueField={'id.id'}
                    showSearch
                    message={i18n.t('dashboard.assign-dashboard-to-customer-text')}
                    title={i18n.t('dashboard.assign-dashboard-to-customer')}
                    onSelect={this.handleSelectDevice}
                />
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    statusMessage: state.dashboards.statusMessage,
    data: state.dashboards.data,
    dashboard: state.dashboards.dashboard,
    errorMessage: state.dashboards.errorMessage,
    shortInfo: state.customers.shortInfo,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getDashboardsRequest: actions.getDashboardsRequest,
    getDashboardRequest: actions.getDashboardRequest,
    saveDashboardRequest: actions.saveDashboardRequest,
    deleteDashboardRequest: actions.deleteDashboardRequest,
    multipleDeleteDashboardRequest: actions.multipleDeleteDashboardRequest,
    getServerTimeDiffRequest: actions.getServerTimeDiffRequest,
    getCustomerShortInfoRequest: customers.getCustomerShortInfoRequest,
    multipleAssignDashboardToCustomer: actions.multipleAssignDashboardToCustomer,
    clearDashboardsRequest: actions.clearDashboardsRequest,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Dashboards);
