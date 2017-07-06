import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Modal, notification, Button } from 'antd';
import { translate } from 'react-i18next';

import CommonButton from '../components/common/CommonButton';
import CommonCheckbox from '../components/common/CommonCheckbox';
import CommonCard from '../components/common/CommonCard';
import AddDashboardModal from '../components/dashboard/AddDashboardModal';

import * as actions from '../actions/dashboards';
import * as customers from '../actions/customers';

@translate(['dashboard'], { wait: false })
class Dashboards extends Component {

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
        console.log('Dashboards Render');
        this.refershDashboardRequest();
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (prevProps.shortInfo === this.props.shortInfo) {
            return false;
        }
        return true;
    }

    buttonComponents = (title, dashboardId, customerId) => {
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

        const modalConfirmAction = this.handleDeleteConfirm.bind(this, title, dashboardId);
        return (
            <Button.Group className="custom-card-buttongroup">
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    iconClassName="search"
                    tooltipTitle={t('dashboard.dashboard-details')}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={this.state.authority}
                    iconClassName="export"
                    tooltipTitle={t('dashboard.export')}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={shareVisible}
                    iconClassName={isPublic ? 'cloud-download-o' : 'cloud-upload-o'}
                    tooltipTitle={isPublic ? '대시보드 공유 해제' : '대시보드 공유'}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={assignVisible}
                    iconClassName={isAssign ? 'user-delete' : 'user-add'}
                    tooltipTitle={isAssign ? t('dashboard.unassign-from-Commoner') : t('dashboard.assign-to-customer')}
                />
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={deleteVisible}
                    iconClassName="delete"
                    onClick={modalConfirmAction}
                    tooltipTitle={t('dashboard.delete')}
                />
            </Button.Group>
        );
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const id = data.id.id;
            const customerId = data.customerId.id;
            return (
                <CommonCard key={id} style={{ cursor: 'pointer' }} id={id} title={<CommonCheckbox value={id} onChange={this.handleChecked}>{title}</CommonCheckbox>}>
                    {this.buttonComponents(title, id, customerId)}
                </CommonCard>
            );
        });
        return components;
    }

    refershDashboardRequest = () => {
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
        const newTitle = `'${title}' 대시보드를 삭제하시겠습니까?`;
        const newContent = '대시보드 및 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
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
        const newTitle = `대시보드 ${checkedCount}개를 삭제하시겠습니까?`;
        const newContent = '선택된 대시보드는 삭제되고 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
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

    handleSaveDashboard = () => {
        const form = this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            this.props.saveDashboardRequest(values).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershDashboardRequest();
                    this.hideAddDashboardModal();
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
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CommonButton
                        shape="circle"
                        visible={this.state.checkedCount !== 0}
                        tooltipTitle={`대시보드 ${this.state.checkedCount}개 삭제`}
                        className="custom-card-button"
                        iconClassName="delete"
                        onClick={this.handleMultipleDeleteConfirm}
                        size="large"
                    />
                    <CommonButton
                        shape="circle"
                        visible={this.state.isCustomer}
                        tooltipTitle={t('dashboard.add-dashboard-text')}
                        className="custom-card-button"
                        iconClassName="plus"
                        onClick={this.openAddDashboardModal}
                        size="large"
                    />
                </div>
                <AddDashboardModal ref={(c) => { this.addModal = c; }} onSave={this.handleSaveDashboard} onCancel={this.hideAddDashboardModal} />
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    statusMessage: state.dashboards.statusMessage,
    data: state.dashboards.data,
    errorMessage: state.dashboards.errorMessage,
    shortInfo: state.customers.shortInfo,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getDashboardsRequest: actions.getDashboardsRequest,
    saveDashboardRequest: actions.saveDashboardRequest,
    deleteDashboardRequest: actions.deleteDashboardRequest,
    multipleDeleteDashboardRequest: actions.multipleDeleteDashboardRequest,
    getCustomerShortInfoRequest: customers.getCustomerShortInfoRequest,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Dashboards);
