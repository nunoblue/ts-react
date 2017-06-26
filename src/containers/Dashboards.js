import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification } from 'antd';

import CustomButton from '../components/common/CustomButton';
import CustomModal from '../components/common/CustomModal';
import CustomCheckbox from '../components/common/CustomCheckbox';
import CustomCard from '../components/common/CustomCard';
import AddDashboardForm from '../components/dashboard/AddDashboardForm';
import AddDashboardModal from '../components/dashboard/AddDashboardModal';

import * as actions from '../actions/dashboards';

class Dashboards extends Component {

    state = {
        limit: 30,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
    }

    componentDidMount() {
        console.log('Dashboards Render');
        this.refershDashboardRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const id = data.id.id;
            const modalConfirmAction = this.handleDeleteConfirm.bind(this, title, id);
            return (
                <CustomCard key={id} id={id} title={<CustomCheckbox value={id} onChange={this.handleChecked}>{title}</CustomCheckbox>}>
                    <CustomButton className="custom-card-button" iconClassName="user-add" tooltipTitle="대시보드 상세정보" />
                    <CustomButton className="custom-card-button" iconClassName="tablet" tooltipTitle="대시보드 공유" />
                    <CustomButton className="custom-card-button" iconClassName="layout" tooltipTitle="커스터머 선택" />
                    <CustomButton className="custom-card-button" iconClassName="delete" onClick={modalConfirmAction} tooltipTitle="대시보드 삭제" />
                </CustomCard>
            );
        });
        return components;
    }

    refershDashboardRequest = () => {
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.setState({
            checkedIdArray: [],
            checkedCount: 0,
        });
        this.props.getDashboardsRequest(limit, textSearch);
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

    openCreateDashboard = () => {
        this.createModal.modal.onShow();
    }

    openModifyDashboard = (title, dashboardId) => {
        this.modifyModal.onShow();
        this.modifyForm.setFieldsValue({
            title,
        });
    }

    hideCreateDashboard = () => {
        this.createModal.form.resetFields();
        this.createModal.modal.onHide();
    }

    hideModifyDashboard = () => {
        this.modifyForm.resetFields();
        this.modifyModal.onHide();
    }

    handleDeleteDashboard = (dashboardId) => {
        this.props.deleteDashboardRequest(dashboardId).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDashboardRequest();
            }
        });
    }

    handleMultipleDeleteDashboard = () => {
        this.props.multipleDeleteDashboardRequest(this.state.checkedIdArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershDashboardRequest();
            }
        });
    }

    handleCreateDashboard = () => {
        const form = this.createModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            this.props.saveDashboardRequest(values).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershDashboardRequest();
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

    handleModifyDashboard = () => {
        const modifyForm = this.modifyForm;
        modifyForm.validateFields((err, values) => {
            if (err) {
                return false;
            }
            this.props.saveDashboardRequest(values).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershDashboardRequest();
                    modifyForm.resetFields();
                    this.modifyModal.onHide();
                }
            });
        });
    }

    render() {
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CustomButton
                    isUsed={this.state.checkedCount !== 0}
                    tooltipTitle={`대시보드 ${this.state.checkedCount}개 삭제`}
                    className="custom-card-button" iconClassName="delete"
                    onClick={this.handleDeleteConfirm}
                    size="large"
                    />
                    <CustomButton tooltipTitle="대시보드 추가" className="custom-card-button" iconClassName="plus" onClick={this.openCreateDashboard} size="large" />
                </div>
                <AddDashboardModal ref={(c) => { this.createModal = c; }} onCreate={this.handleCreateDashboard} onHideModal={this.hideCreateDashboard} />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.dashboards.statusMessage,
        data: state.dashboards.data,
        errorMessage: state.dashboards.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDashboardsRequest: (limit, textSearch) => {
            return dispatch(actions.getDashboardsRequest(limit, textSearch));
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
