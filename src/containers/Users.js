import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Modal, notification, Button } from 'antd';
import i18n from 'i18next';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';
import CommonCheckbox from '../components/common/CommonCheckbox';
import AddUserModal from '../components/user/AddUserModal';
import DetailUserDialog from '../components/user/DetailUserDialog';

import * as actions from '../actions/users';

class Users extends Component {
    state = {
        limit: 40,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
        selectedUser: null,
        dialogVisible: false,
    };

    componentDidMount() {
        console.log('Users Render');
        this.refershUserRequest();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (nextState.selectedUser !== this.state.selectedUser) {
            return true;
        } else if (nextState.dialogVisible !== this.state.dialogVisible) {
            return true;
        } else if (nextProps.data === this.props.data) {
            return false;
        }
        return true;
    }

    buttonComponents = (email, id, isPublic, type) => {
        const modalConfirmAction = this.handleDeleteConfirm.bind(this, email, id);
        const sendActivationMail = this.sendActivationMail.bind(this, email);
        return (
            <Button.Group>
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={type === 'dialog'}
                    onClick={sendActivationMail}
                    tooltipTitle={i18n.t('user.resend-activation')}
                >
                    <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                </CommonButton>
                <CommonButton
                    className="custom-card-button"
                    shape="circle"
                    visible={!isPublic}
                    iconClassName="delete"
                    onClick={modalConfirmAction}
                    tooltipTitle={i18n.t('user.delete')}
                />
            </Button.Group>
        );
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const email = data.email;
            const firstName = data.firstName || '';
            const lastName = data.lastName || '';
            const id = data.id.id;
            const isPublic = data.additionalInfo ? (data.additionalInfo.isPublic || false) : false;
            const openDialog = this.openDetailDialog.bind(this, id);
            const closeDialog = this.closeDetailDialog;
            return (
                <CommonCard
                    key={id}
                    style={{ cursor: 'pointer' }}
                    title={<CommonCheckbox value={id} onChange={this.handleChecked}>{email}</CommonCheckbox>}
                    content={`${firstName} ${lastName}`}
                    onSelfEvent={closeDialog}
                    onNextEvent={openDialog}
                    isCardDown={!this.state.dialogVisible}
                >
                    {this.buttonComponents(email, id, isPublic)}
                </CommonCard>
            );
        });

        return components;
    }

    refershUserRequest = () => {
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        const userId = this.props.match.params.customerId;
        this.setState({
            checkedIdArray: [],
            checkedCount: 0,
        });
        this.props.getUsersRequest(limit, textSearch, userId).then(() => {
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
        const newTitle = i18n.t('user.delete-user-title', { userEmail: title });
        const newContent = i18n.t('user.delete-user-text');
        const deleteEvent = this.handleDeleteUser.bind(this, id);
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
        const newTitle = i18n.t('user.delete-users-title', { count: checkedCount });
        const newContent = i18n.t('user.delete-users-text');
        const deleteEvent = this.handleMultipleDeleteUser;
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: i18n.t('action.yes'),
            cancelText: i18n.t('action.no'),
            onOk: deleteEvent,
        });
    }

    openAddUserModal = () => {
        this.addModal.modal.onShow();
    }

    hideAddUserModal = () => {
        this.addModal.form.resetFields();
        this.addModal.modal.onHide();
    }

    handleDeleteUser = (userId) => {
        this.props.deleteUserRequest(userId).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershUserRequest();
                this.closeDetailDialog();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleMultipleDeleteUser = () => {
        this.props.multipleDeleteUserRequest(this.state.checkedIdArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershUserRequest();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleSaveUser = (type) => {
        const isDialog = type === 'dialog';
        const form = isDialog ? this.detailDialog.form : this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            const additionalInfo = {
                defaultDashboardFullscreen: values.defaultDashboardFullscreen,
                description: values.description,
            };
            delete values.defaultDashboardFullscreen;
            delete values.description;
            const user = {};
            if (isDialog) {
                Object.assign(user, this.state.selectedUser, values, { additionalInfo });
                this.setState({
                    selectedUser: user,
                });
            } else {
                Object.assign(user, values, {
                    authority: 'CUSTOMER_USER',
                    customerId: {
                        id: this.props.match.params.customerId,
                        entityType: 'CUSTOMER',
                    },
                    additionalInfo,
                });
            }
            this.props.saveUserRequest(user).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershUserRequest();
                    if (!isDialog) {
                        this.hideAddUserModal();
                    } else {
                        this.openDetailDialog(this.state.selectedUser.id.id);
                    }
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    openDetailDialog = (selectedUserId) => {
        this.detailDialog.clearEdit();
        const userData = this.loadUserDetailData(selectedUserId);
        this.detailDialog.initTitle(userData.email);
        let defaultDashboardFullscreen;
        let description;
        if (userData.additionalInfo) {
            defaultDashboardFullscreen = userData.additionalInfo.defaultDashboardFullscreen || null;
            description = userData.additionalInfo.description || null;
        }
        this.detailDialog.form.setFieldsValue({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            description,
            defaultDashboardFullscreen,
        });
        this.setState({
            dialogVisible: true,
            selectedUser: userData,
        });
    }

    closeDetailDialog = () => {
        this.detailDialog.form.resetFields();
        this.setState({
            dialogVisible: false,
            selectedUser: null,
        });
    }

    loadUserDetailData = (selectedUserId) => {
        const { data } = this.props;
        const userId = this.state.selectedUser ? this.state.selectedUser.id.id : null;
        let findUser;
        if (selectedUserId === userId) {
            findUser = this.state.selectedUser;
            return findUser;
        }
        data.some((user) => {
            if (user.id.id === selectedUserId) {
                findUser = user;
                return true;
            }
            return false;
        });
        return findUser;
    }

    sendActivationMail = (email) => {
        this.props.sendActivationMailRequest(email).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                notification.success({
                    message: i18n.t('user.activation-email-sent-message'),
                });
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    render() {
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CommonButton
                        className="custom-card-button"
                        iconClassName="delete"
                        shape="circle"
                        visible={this.state.checkedCount !== 0}
                        tooltipTitle={i18n.t('user.delete-users-action-title', { count: this.state.checkedCount })}
                        onClick={this.handleMultipleDeleteConfirm}
                        size="large"
                    />
                    <CommonButton
                        shape="circle"
                        tooltipTitle={i18n.t('user.add')}
                        className="custom-card-button"
                        iconClassName="plus"
                        onClick={this.openAddUserModal}
                        size="large"
                    />
                </div>
                <AddUserModal
                    ref={(c) => { this.addModal = c; }}
                    onSave={this.handleSaveUser}
                    onCancel={this.hideAddUserModal}
                />
                <DetailUserDialog
                    ref={(c) => { this.detailDialog = c; }}
                    data={this.state.selectedUser}
                    visible={this.state.dialogVisible}
                    closeDialog={this.closeDetailDialog}
                    onSave={this.handleSaveUser}
                    buttonComponents={this.buttonComponents}
                />
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.users.data,
    statusMessage: state.users.statusMessage,
    errorMessage: state.users.errorMessage,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getUsersRequest: actions.getUsersRequest,
    saveUserRequest: actions.saveUserRequest,
    deleteUserRequest: actions.deleteUserRequest,
    multipleDeleteUserRequest: actions.multipleDeleteUserRequest,
    sendActivationMailRequest: actions.sendActivationMailRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Users);
