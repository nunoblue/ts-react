import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import SortableItems from '../../components/rule/SortableItems';
import CommonModal from '../../components/common/CommonModal';
import CommonButton from '../../components/common/CommonButton';
import PluginActionForm from '../../components/rule/PluginActionForm';
import * as ruleActions from '../../actions/rule/rules';

class PluginActionContainer extends Component {
    static propTypes = {
        action: PropTypes.object,
        actionComponent: PropTypes.object,
        onEdit: PropTypes.func,
        onDelete: PropTypes.func,
        onSave: PropTypes.func,
    };

    state = {
        modal: {
            visible: false,
        },
        action: this.props.action || {},
    };

    modalHandler = {
        show: (action = {}) => {
            this.setState({
                modal: {
                    visible: true,
                },
                action,
            });
        },
        hide: () => {
            this.form.resetFields();
            this.setState({
                modal: {
                    visible: false,
                },
            });
        },
        ok: () => {
            this.form.validateFields((err, values) => {
                if (err) {
                    return false;
                }

                const { name, clazz } = values;
                const newAction = {
                    name,
                    clazz,
                    configuration: {},
                };

                Object.keys(values).forEach((key) => {
                    if (key !== 'name' && key !== 'clazz') {
                        newAction.configuration[key] = values[key];
                    }
                })

                this.props.onSave(newAction);
                this.modalHandler.hide();
            });
        },
    };

    sortableHandler = {
        edit: (action) => {
            this.props.onEdit(action);
        },
        delete: (action) => {
            this.props.onDelete(action);
        },
    };

    sortableItems = () => {
        if (_.isEmpty(this.props.actionComponent)) {
            return null;
        }
        console.log('sortableItems', this.props.action, this.props.actionComponent);
        return (
            <SortableItems
                items={this.props.action}
                itemConfig={this.props.actionComponent}
                onEdit={this.modalHandler.show}
                onDelete={this.sortableHandler.delete}
            />
        );
    }

    render() {
        console.log('Render : PluginActionContainer.js', this.props.action, this.props.actionComponent);
        const { modal } = this.state;
        const isNew = _.isEmpty(this.props.action);
        return (
            <div>
                <ul>
                    {this.sortableItems()}
                </ul>

                <CommonButton
                    type="primary"
                    iconClassName="plus"
                    onClick={this.modalHandler.show}
                    visible={isNew}
                >
                    만들기
                </CommonButton>

                <CommonModal
                    ref={(c) => { this.modal = c; }}
                    title={isNew ? '추가' : '수정'}
                    onOk={this.modalHandler.ok}
                    onCancel={this.modalHandler.hide}
                    okText={isNew ? '추가' : '수정'}
                    cancelText="취소"
                    visible={modal.visible}
                >
                    <PluginActionForm
                        ref={(c) => { this.form = c; }}
                        component={this.props.actionComponent}
                        action={this.state.action}
                    />

                </CommonModal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        actionComponentTemp: state.rules.actionComponent,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getComponentRequest: clazz => dispatch(ruleActions.getComponentRequest(clazz)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PluginActionContainer);
