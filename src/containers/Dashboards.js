import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification } from 'antd';
import { translate } from 'react-i18next';
import i18next from 'i18next';

import CustomButton from '../components/common/CustomButton';
import CustomCheckbox from '../components/common/CustomCheckbox';
import CustomCard from '../components/common/CustomCard';
import AddDashboardModal from '../components/dashboard/AddDashboardModal';

import * as actions from '../actions/dashboards';

@translate(['dashboard'], { wait: false })
class Dashboards extends Component {

    state = {
        limit: 30,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
        authority: this.props.currentUser.authority === 'TENANT_ADMIN',
    }

    componentDidMount() {
        console.log('Dashboards Render');
        this.refershDashboardRequest();
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
            const title = data.title;
            const id = data.id.id;
            const modalConfirmAction = this.handleDeleteConfirm.bind(this, title, id);
            return (
                <CustomCard key={id} id={id} title={<CustomCheckbox value={id} onChange={this.handleChecked}>{title}</CustomCheckbox>}>
                    <CustomButton className="custom-card-button" iconClassName="search" tooltipTitle="대시보드 상세정보" />
                    <CustomButton className="custom-card-button" visible={this.state.authority} iconClassName="tablet" tooltipTitle="대시보드 공유" />
                    <CustomButton className="custom-card-button" visible={this.state.authority} iconClassName="layout" tooltipTitle="커스터머 선택" />
                    <CustomButton className="custom-card-button" visible={this.state.authority} iconClassName="delete" onClick={modalConfirmAction} tooltipTitle="대시보드 삭제" />
                </CustomCard>
            );
        });
        return components;
    }

    refershDashboardRequest = () => {
        const { currentUser, match } = this.props;
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
        this.props.getDashboardsRequest(limit, textSearch, authority, customerId).then(() => {
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
            newTitle = `'${title}' 대시보드를 삭제하시겠습니까?`;
            newContent = '대시보드 및 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleDeleteDashboard.bind(this, id);
        } else {
            newTitle = `대시보드 ${checkedCount}개를 삭제하시겠습니까?`;
            newContent = '선택된 대시보드는 삭제되고 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleMultipleDeleteDashboard.bind(this, id);
        }
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
                    <CustomButton
                    visible={this.state.checkedCount !== 0}
                    tooltipTitle={`대시보드 ${this.state.checkedCount}개 삭제`}
                    className="custom-card-button"
                    iconClassName="delete"
                    onClick={this.handleDeleteConfirm}
                    size="large"
                    />
                    <CustomButton visible={this.state.authority} tooltipTitle={t('dashboard.add-dashboard-text')} className="custom-card-button" iconClassName="plus" onClick={this.openAddDashboardModal} size="large" />
                </div>
                <AddDashboardModal ref={(c) => { this.addModal = c; }} onSave={this.handleSaveDashboard} onCancel={this.hideAddDashboardModal} />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.dashboards.statusMessage,
        data: state.dashboards.data,
        errorMessage: state.dashboards.errorMessage,
        currentUser: state.authentication.currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDashboardsRequest: (limit, textSearch, currentUser, customerId) => {
            return dispatch(actions.getDashboardsRequest(limit, textSearch, currentUser, customerId));
        },
        saveDashboardRequest: (dashboard) => {
            return dispatch(actions.saveDashboardRequest(dashboard));
        },
        deleteDashboardRequest: (dashboardId) => {
            return dispatch(actions.deleteDashboardRequest(dashboardId));
        },
        multipleDeleteDashboardRequest: (dashboardIdArray) => {
            return dispatch(actions.multipleDeleteDashboardRequest(dashboardIdArray));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboards);
