import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';

import * as actions from '../../actions/rule/rules';
import SortableItems from '../../components/rule/SortableItems';
import CommonModal from '../../components/common/CommonModal';
import CommonButton from '../../components/common/CommonButton';
import ProcessorForm from '../../components/rule/ProcessorForm';


const PROCESSOR = 'PROCESSOR';

class ProcessorContainer extends Component {
    static propTypes = {
        processor: PropTypes.object,
    };

    state = {
        modal: {
            visible: false,
        },
        processor: this.props.processor || {},
    };

    componentDidMount() {
        this.props.getComponentsRequest(PROCESSOR);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.props.processor) !== JSON.stringify(nextProps.processor)) {
            return true;
        } else if (JSON.stringify(this.state.modal.visible) !== JSON.stringify(nextState.modal.visible)) {
            return true;
        } else if (JSON.stringify(this.state.processor) !== JSON.stringify(nextState.processor)) {
            return true;
        } else if (JSON.stringify(this.props.processorComponents) === JSON.stringify(nextProps.processorComponents)) {
            return false;
        }
        return true;
    }

    modalHandler = {
        show: (processor = {}) => {
            this.setState({
                modal: {
                    visible: true,
                },
                processor,
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
                const { name, clazz, alarmIdTemplate, alarmBodyTemplate } = values;
                const newProcessor = {
                    name,
                    clazz,
                    configuration: {
                        alarmIdTemplate,
                        alarmBodyTemplate,
                    },
                };

                this.props.onSave(newProcessor);
                this.modalHandler.hide();
            });
        },
    };

    sortableHandler = {
        edit: (processor) => {
            this.props.onEdit(processor);
        },
        delete: (processor) => {
            this.props.onDelete(processor);
        },
    };

    render() {
        console.log('Render ProcessorContainer.js');
        const { modal } = this.state;
        const isNew = _.isEmpty(this.props.processor);
        return (
            <div>
                <ul>
                    <SortableItems
                        items={this.props.processor}
                        itemConfig={this.props.processorComponents}
                        onEdit={this.modalHandler.show}
                        onDelete={this.sortableHandler.delete}
                        componentTypeName="프로세서"
                    />
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

                    <ProcessorForm
                        ref={(c) => { this.form = c; }}
                        components={this.props.processorComponents}
                        processor={this.state.processor}
                    />
                </CommonModal>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        statusMessage: state.rules.statusMessage,
        processorComponents: state.rules.processorComponents,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getComponentsRequest: componentType => dispatch(actions.getComponentsRequest(componentType)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessorContainer);