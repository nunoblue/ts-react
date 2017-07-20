import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import SortableItems from '../../components/rule/SortableItems';
import CommonModal from '../../components/common/CommonModal';
import FilterForm from '../../components/rule/FilterForm';
import * as actions from '../../actions/rule/rules';

const FILTER = 'FILTER';
const MESSAGE_TYPE_FILTER = 'messageTypes';
const FILTER_FILTER = 'filter';
const METHOD_NAME_FILTER = 'methodNames';

let filterKey = 1;
class FilterList extends Component {
    static propTypes = {
        filters: PropTypes.array,
    }

    state = {
        modal: {
            visible: false,
        },
        filter: {},
    }

    componentDidMount() {
        this.props.getComponentsRequest(FILTER);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.props.filters) !== JSON.stringify(nextProps.filters)) {
            return true;
        } else if (JSON.stringify(this.props.filters) !== JSON.stringify(nextProps.filters)) {
                return true;
        } else if (JSON.stringify(this.state.modal.visible) !== JSON.stringify(nextState.modal.visible)) {
            return true;
        } else if (JSON.stringify(this.state.filter) !== JSON.stringify(nextState.filter)) {
            return true;
        } else if (JSON.stringify(this.props.filterComponents) === JSON.stringify(nextProps.filterComponents)) {
            return false;
        }
        return true;
    }

    modalHandler = {
        show: (filter = {}) => {
            this.setState({
                modal: {
                    visible: true,
                },
                filter,
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

                const filterObj = this.props.filterComponents.find(filter => filter.clazz === values.clazz);
                const filterType = Object.keys(filterObj.configurationDescriptor.schema.properties)[0];
                const filterTypeName = filterObj.configurationDescriptor.schema.properties[filterType].title;
                const key = this.state.filter.key || filterKey;

                const { clazz, name } = values;
                const newFilter = {
                    key,
                    clazz,
                    name,
                    configuration: {},
                    filterTypeName,
                };
                if (filterType === FILTER_FILTER) {
                    const { filterString } = values;
                    newFilter.configuration.filter = filterString;
                } else if (filterType === MESSAGE_TYPE_FILTER) {
                    const { messageTypes } = values;
                    newFilter.configuration.messageTypes = messageTypes;
                } else if (filterType === METHOD_NAME_FILTER) {
                    const methodNames = values.keys.map((key) => {
                        return { name: values[`methodNames-${key}`] };
                    });
                    newFilter.configuration.methodNames = methodNames;
                }

                if (!this.state.filter.key) {
                    this.props.onAdd(newFilter);
                    filterKey += 1;
                } else {
                    this.props.onSave(newFilter);
                }

                this.modalHandler.hide();
            });
        },
    }

    sortableHandler = {
        edit: (filter) => {
            this.props.onEdit(filter);
        },
        delete: (filter) => {
            this.props.onDelete(filter);
        },
    };

    render() {
        console.log('Render: FilterContainer.js');
        const isEdit = this.state.filter.key || (this.state.filter.key > -1);
        const { modal } = this.state;

        return (
            <div>
                <ul>
                    <SortableItems
                        items={this.props.filters}
                        itemConfig={this.props.filterComponents}
                        onEdit={this.modalHandler.show}
                        onDelete={this.sortableHandler.delete}
                        componentTypeName="필터"
                        disabled={this.props.disabled}
                    />
                </ul>
                <Button type="primary" icon="plus" onClick={this.modalHandler.show}>추가</Button>

                <CommonModal
                    ref={(c) => { this.modal = c; }}
                    title={isEdit ? '수정' : '추가'}
                    onOk={this.modalHandler.ok}
                    onCancel={this.modalHandler.hide}
                    okText={isEdit ? '수정' : '추가'}
                    cancelText="취소"
                    visible={modal.visible}
                >

                    <FilterForm
                        ref={(c) => { this.form = c; }}
                        filters={this.props.filterComponents}
                        filter={this.state.filter}
                    />
                </CommonModal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.rules.statusMessage,
        filterComponents: state.rules.filterComponents,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getComponentsRequest: componentType => dispatch(actions.getComponentsRequest(componentType)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterList);
