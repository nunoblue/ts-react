import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification } from 'antd';

import config from '../config';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';

import * as actions from '../actions/rules';
import AddRuleModal from '../components/rule/AddRuleModal';

class Rules extends Component {

    componentDidMount() {
        this.props.getRulesRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const state = data.state;
            const id = data.id.id;
            const nullUID = config.nullUID;
            const deleteConfirm = this.handleDeleteConfirm.bind(this, name, id);
            return (
                <CommonCard
                    key={id}
                    style={{ cursor: 'pointer' }}
                    title={name}
                    content={state}
                    buttonTooltip="Rule Delete"
                >
                    <CommonButton
                        visible={data && nullUID !== data.tenantId.id}
                        className="custom-card-button"
                        iconClassName="delete"
                        tooltipTitle="룰 삭제"
                        onClick={deleteConfirm}
                    />
                </CommonCard>
            );
        });
        return components;
    }

    openAddRuleModal = () => {
        this.addModal.modal.onShow();
    }

    closeAddRuleModal = () => {
        // this.addModal.form.formBuilder.resetFields();
        this.addModal.modal.onHide();
    }

    handleSaveRule = () => {
        // validateFields method is in form.formBuilder not form of antd
        const formBuilder = this.addModal.form.formBuilder;
        formBuilder.validateFields((err, values) => {
            if (err) {
                return false;
            }

            this.props.saveRuleRequest(values).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.props.getRulesRequest();
                    this.closeAddRuleModal();
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    handleDeleteConfirm = (title, id) => {
        // const checkedCount = this.state.checkedCount;
        let newTitle;
        let newContent;
        let deleteEvent;
        // if (checkedCount === 0) {
            newTitle = `'${title}' 규칙을 삭제하시겠습니까?`;
            newContent = '규칙과 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleDeleteRules.bind(this, id);
        // } else {
        //     newTitle = `커스터머 ${checkedCount}개를 삭제하시겠습니까?`;
        //     newContent = '선택된 커스터머는 삭제되고 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
        //     deleteEvent = this.handleMultipleDeleteCustomer.bind(this, id);
        // }
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: '예',
            cancelText: '아니오',
            onOk: deleteEvent,
        });
    }

    handleDeleteRules = (id) => {
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

    render() {
        return (
            <Row>
                { this.components() }
                <AddRuleModal
                    ref={(c) => { this.addModal = c; }}
                    onSave={this.handleSaveRule}
                    onCancel={this.closeAddRuleModal}
                />

                <div className="footer-buttons">
                    <CommonButton
                        tooltipTitle="룰 추가"
                        className="custom-card-button"
                        iconClassName="plus"
                        onClick={this.openAddRuleModal}
                        size="large"
                    />
                </div>
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.rules.statusMessage,
        data: state.rules.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRulesRequest: () => dispatch(actions.getRulesRequest()),
        saveRuleRequest: rule => dispatch(actions.saveRuleRequest(rule)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);
