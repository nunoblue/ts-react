import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification } from 'antd';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';
import CommonCheckbox from '../components/common/CommonCheckbox';
import AddUserModal from '../components/user/AddUserModal';

import * as actions from '../actions/users';

class Users extends Component {
    state = {
        limit: 40,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
    };

    componentDidMount() {
        console.log('Users Render');
        this.refershUserRequest();
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (prevProps.data === this.props.data) {
            return false;
        }
        return true;
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const email = data.email;
            const firstName = data.firstName || '';
            const lastName = data.lastName || '';
            const id = data.id.id;
            const isPublic = data.additionalInfo ? (data.additionalInfo.isPublic || false) : false;
            const modalConfirmAction = this.handleDeleteConfirm.bind(this, email, id);
            return (
                <CommonCard key={id} style={{ cursor: 'pointer' }} id={id} title={<CommonCheckbox value={id} onChange={this.handleChecked}>{email}</CommonCheckbox>} content={`${firstName} ${lastName}`}>
                    <CommonButton className="custom-card-button" shape="circle" visible={!isPublic} iconClassName="delete" onClick={modalConfirmAction} tooltipTitle="유저 디바이스 삭제" />
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
        const checkedCount = this.state.checkedCount;
        let newTitle;
        let newContent;
        let deleteEvent;
        if (checkedCount === 0) {
            newTitle = `'${title}' 유저를 삭제하시겠습니까?`;
            newContent = '유저 및 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleDeleteUser.bind(this, id);
        } else {
            newTitle = `유저 ${checkedCount}개를 삭제하시겠습니까?`;
            newContent = '선택된 유저는 삭제되고 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleMultipleDeleteUser.bind(this, id);
        }
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: '예',
            cancelText: '아니오',
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

    handleSaveUser = () => {
        const form = this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            const user = $.extend(true, values, {
                authority: 'CUSTOMER_USER',
                additionalInfo: {
                    defaultDashboardFullscreen: values.defaultDashboardFullscreen,
                },
                customerId: {
                    id: this.props.match.params.customerId,
                    entityType: 'CUSTOMER',
                },
            });

            delete user.defaultDashboardFullscreen;
            this.props.saveUserRequest(user).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershUserRequest();
                    this.hideAddUserModal();
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    render() {
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CommonButton
                        visible={this.state.checkedCount !== 0}
                        tooltipTitle={`유저 ${this.state.checkedCount}개 삭제`}
                        className="custom-card-button"
                        iconClassName="delete"
                        onClick={this.handleDeleteConfirm}
                        size="large"
                    />
                    <CommonButton shape="circle" tooltipTitle="유저 추가" className="custom-card-button" iconClassName="plus" onClick={this.openAddUserModal} size="large" />
                </div>
                <AddUserModal ref={(c) => { this.addModal = c; }} onSave={this.handleSaveUser} onCancel={this.hideAddUserModal} />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.users.data,
        statusMessage: state.users.statusMessage,
        errorMessage: state.users.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUsersRequest: (limit, textSearch, userId) => {
            return dispatch(actions.getUsersRequest(limit, textSearch, userId));
        },
        saveUserRequest: (user) => {
            return dispatch(actions.saveUserRequest(user));
        },
        deleteUserRequest: (userId) => {
            return dispatch(actions.deleteUserRequest(userId));
        },
        multipleDeleteUserRequest: (userIdArray) => {
            return dispatch(actions.multipleDeleteUserRequest(userIdArray));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
