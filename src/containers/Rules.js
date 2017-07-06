import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification } from 'antd';

import config from '../config';

import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';

import * as actions from '../actions/rules';
import AddRuleModal from '../components/rule/AddRuleModal';
import CustomCheckbox from "../components/common/CustomCheckbox";

class Rules extends Component {

    state = {
        checkedCount: 0,
        checkedIdArray: [],
        rule: {},
    };

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
            const openEditRuleModal = this.modalHandler.show.bind(this, id);
            return (
                <CustomCard
                    key={id}
                    title={
                        <CustomCheckbox value={id} onChange={this.handleChecked}>
                            {name}
                        </CustomCheckbox>
                    }
                    content={state}
                    buttonTooltip="Rule Delete"
                    onClick={openEditRuleModal}
                >
                    <CustomButton
                        visible={data && nullUID !== data.tenantId.id}
                        className="custom-card-button"
                        iconClassName="delete"
                        tooltipTitle="규칙 삭제"
                        onClick={deleteConfirm}
                    />
                </CustomCard>
            );
        });
        return components;
    };

    modalHandler = {
        show: (id) => {
            const dataList = this.props.data;
            const rule = id ? dataList.find(item => item.id.id === id) : {};
            this.setState({
                rule,
            })
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
        formBuilder.validateFields((err, values) => {
            if (err) {
                return false;
            }

            this.props.saveRuleRequest(values).then(() => {
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

    render() {
        const { rule } = this.state;
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
                    <CustomButton
                        visible={this.state.checkedCount > 0}
                        tooltipTitle={`규칙 ${this.state.checkedCount}건 삭제`}
                        className="custom-card-button"
                        iconClassName="delete"
                        onClick={this.handleDeleteConfirm}
                        size="large"
                        shape="circle"
                    />
                    <CustomButton
                        tooltipTitle="규칙 추가"
                        className="custom-card-button"
                        iconClassName="plus"
                        onClick={handleShowAddModal}
                        size="large"
                        shape="circle"
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
        deleteRulesRequest: idArray => dispatch(actions.deleteRulesRequest(idArray)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);
