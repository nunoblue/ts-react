import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification, Button } from 'antd';
import _ from 'lodash';

import config from '../config';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';

import * as actions from '../actions/rules';
import AddRuleModal from '../components/rule/AddRuleModal';
import CommonCheckbox from '../components/common/CommonCheckbox';
import RuleDetailDialog from '../components/rule/RuleDetailDialog';

class Rules extends Component {

    state = {
        checkedCount: 0,
        checkedIdArray: [],
        rule: {},
        dialogVisible: false,
        selectedRule: {},
    };

    componentDidMount() {
        this.props.getRulesRequest();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.checkedCount !== this.state.checkedCount) {
            return true;
        } else if (nextState.selectedRule !== this.state.selectedRule) {
            return true;
        } else if (nextState.dialogVisible !== this.state.dialogVisible) {
            return true;
        } else if (nextProps.data === this.props.data) {
            return false;
        }
        return true;
    }

    modalHandler = {
        show: (id) => {
            const dataList = this.props.data;
            const rule = id ? dataList.find(item => item.id.id === id) : {};
            this.setState({
                rule,
            });
            this.addModal.modal.onShow();
        },
        hide: () => {
            // this.addModal.form.formBuilder.resetFields();
            this.addModal.modal.onHide();
        },
    };

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
            const index = checkedIdArray.indexOf(e.target.value);
            checkedIdArray.splice(index, 1);
            this.setState({
                checkedCount: checkedCount - 1,
                checkedIdArray,
            });
        }
    }

    handleSaveRule = () => {
        // validateFields method is in form.formBuilder not form of antd
        const formBuilder = this.addModal.form.formBuilder;
        const addModal = this.addModal;
        formBuilder.validateFields((err, values) => {
            if (err) {
                return false;
            }
            const rule = {
                name: values.name,
                additionalInfo: {
                    description: values.description,
                },
                filters: addModal.state.filters,
                processor: addModal.state.processor,
                action: addModal.state.action,
                pluginToken: addModal.state.plugin.apiToken,
            };

            this.props.saveRuleRequest(rule).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.props.getRulesRequest();
                    this.modalHandler.hide();
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    };

    handleDeleteConfirm = (title, id) => {
        let newTitle;
        const newContent = '규칙과 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
        const deleteEvent = this.handleDeleteRules.bind(this, id);
        if (id) {
            newTitle = `'${title}' 규칙을 삭제하시겠습니까?`;
        } else {
            newTitle = `${this.state.checkedCount}개의 규칙을 삭제하시겠습니까?`;
        }
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: '예',
            cancelText: '아니오',
            onOk: deleteEvent,
        });
    };

    handleDeleteRules = (id) => {
        const idArray = id ? [id] : this.state.checkedIdArray;

        this.props.deleteRulesRequest(idArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.props.getRulesRequest();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    };

    handleRuleState = (id, state) => {
        this.props.activateRulesRequest(id, state).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.props.getRulesRequest();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    openDetailDialog = (ruleId) => {
        this.detailDialog.clearEdit();
        const rule = this.findRule(ruleId);
        this.detailDialog.initTitle(rule.name);
        this.setState({
            dialogVisible: true,
            selectedRule: rule,
        });
    }

    closeDetailDialog = () => {
        this.setState({
            dialogVisible: false,
            selectedRule: {},
        });
    }

    findRule = (ruleId) => {
        const { data } = this.props;
        return data.find(r => r.id.id === ruleId);
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const { name, state } = data;
            const id = data.id.id;

            const openDialog = this.openDetailDialog.bind(this, id);
            const closeDialog = this.closeDetailDialog;
            return (
                <CommonCard
                    key={id}
                    title={
                        <CommonCheckbox value={id} onChange={this.handleChecked}>
                            {name}
                        </CommonCheckbox>
                    }
                    content={state}
                    buttonTooltip="Rule Delete"
                    onSelfEvent={closeDialog}
                    onNextEvent={openDialog}
                >
                    {this.buttonComponents(data)}
                </CommonCard>
            );
        });
        return components;
    };

    buttonComponents = (rule) => {
        if (rule == null || _.isEmpty(rule)) {
            return null;
        }
        const { name, state } = rule;
        const id = rule.id.id;
        const nullUID = config.nullUID;
        const deleteConfirm = this.handleDeleteConfirm.bind(this, name, id);
        const handleState = this.handleRuleState.bind(this, id, state);
        return (
            <Button.Group className="custom-card-buttongroup">
                <CommonButton
                    visible={rule && nullUID !== rule.tenantId.id}
                    className="custom-card-button"
                    iconClassName={state === 'ACTIVE' ? 'pause' : 'caret-right'}
                    tooltipTitle={state === 'ACTIVE' ? '규칙 비활성화' : '규칙 활성화'}
                    onClick={handleState}
                />
                <CommonButton
                    visible={rule && nullUID !== rule.tenantId.id}
                    className="custom-card-button"
                    iconClassName="delete"
                    tooltipTitle="규칙 삭제"
                    onClick={deleteConfirm}
                />
            </Button.Group>
        );
    }

    render() {
        console.log('Render : Rules.js');
        const { rule, selectedRule } = this.state;
        const handleShowAddModal = this.modalHandler.show.bind(this, null);

        return (
            <Row>
                { this.components() }
                <AddRuleModal
                    ref={(c) => { this.addModal = c; }}
                    onSave={this.handleSaveRule}
                    onCancel={this.modalHandler.hide}
                    rule={rule}
                />

                <div className="footer-buttons">
                    <CommonButton
                        visible={this.state.checkedCount > 0}
                        tooltipTitle={`규칙 ${this.state.checkedCount}건 삭제`}
                        className="custom-card-button"
                        iconClassName="delete"
                        onClick={this.handleDeleteConfirm}
                        size="large"
                        shape="circle"
                    />
                    <CommonButton
                        tooltipTitle="규칙 추가"
                        className="custom-card-button"
                        iconClassName="plus"
                        onClick={handleShowAddModal}
                        size="large"
                        shape="circle"
                    />
                </div>

                <RuleDetailDialog
                    ref={(c) => { this.detailDialog = c; }}
                    rule={selectedRule}
                    filters={selectedRule.filters}
                    processor={selectedRule.processor}
                    pluginToken={selectedRule.pluginToken}
                    action={selectedRule.action}
                    visible={this.state.dialogVisible}
                    closeDialog={this.closeDetailDialog}
                    onSave={this.handleSaveRule}
                    buttonComponents={this.buttonComponents}
                />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.rules.statusMessage,
        data: state.rules.data,
        erorrMessage: state.rules.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRulesRequest: () => dispatch(actions.getRulesRequest()),
        saveRuleRequest: rule => dispatch(actions.saveRuleRequest(rule)),
        deleteRulesRequest: idArray => dispatch(actions.deleteRulesRequest(idArray)),
        activateRulesRequest: (id, state) => dispatch(actions.activateRuleRequest(id, state)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);
