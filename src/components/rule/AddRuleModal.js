import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { Collapse } from 'antd';
import _ from 'lodash';

import CommonModal from '../common/CommonModal';
import RuleForm from './RuleForm';
import FilterContainer from '../../containers/rule/FilterContainer';
import ProcessorContainer from '../../containers/rule/ProcessorContainer';
import PluginContainer from '../../containers/rule/PluginContainer';

const Panel = Collapse.Panel;

class AddRuleModal extends Component {
    static propTypes = {
        rule: PropTypes.object,
    };

    state = {
        rule: this.props.rule,
        filters: this.props.rule.filters || [],
        processor: this.props.rule.processor || {},
        plugin: this.props.rule.plugin || {},
        action: this.props.rule.action || {},
    };

    componentDidMount() {
    }

    handlerFilter = {
        add: (filter) => {
            this.setState({
                filters: update(
                    this.state.filters,
                    {
                        $push: [filter],
                    },
                ),
            });
        },
        edit: (filter) => {
            const { key } = filter;
            const filters = this.state.filters;
            const index = filters.findIndex(savedFilter => savedFilter.key === key);
            this.setState({
                filters: update(
                    this.state.filters,
                    {
                        [index]: {
                            clazz: { $set: filter.clazz },
                            configuration: { $set: filter.configuration },
                            filterTypeName: { $set: filter.filterTypeName },
                            name: { $set: filter.name },
                        }
                    },
                ),
            });
        },
        delete: (filter) => {
            const { key } = filter;
            const filters = this.state.filters;
            const index = filters.findIndex(savedFilter => savedFilter.key === key);
            this.setState({
                filters: update(
                    this.state.filters,
                    {
                        $splice: [[index, 1]],
                    },
                ),
            });
        },
    };

    handlerProcessor = {
        edit: (processor) => {
            this.setState({
                processor,
            });
        },
        delete: () => {
            this.setState({
                processor: {},
            });
        },
    };

    handlerAction = {
        edit: (action) => {
            this.setState({
                action,
            });
        },
        delete: () => {
            this.setState({
                action: {},
            });
        },
    };

    handlerPlugin = (plugin) => {
        this.setState({
            plugin,
        });
    };

    render() {
        console.log('AddRuleModal rendered');
        const rule = this.props.rule;
        const isEdit = _.has(rule, 'id');

        return (
            <CommonModal
                className={this.props.className}
                ref={(c) => { this.modal = c; }}
                title={isEdit ? `${rule.name} 규칙 수정` : '규칙 추가'}
                onOk={this.props.onSave}
                onCancel={this.props.onCancel}
                okText={isEdit ? '수정' : '추가'}
                cancelText="취소"
            >
                <RuleForm
                    ref={(c) => { this.form = c; }}
                    rule={this.props.rule}
                    // onPressEnter={this.props.onSave}
                />

                <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                    <Panel header="필터" key="1">
                        <FilterContainer
                            filters={this.state.filters}
                            onSave={this.handlerFilter.edit}
                            onAdd={this.handlerFilter.add}
                            onDelete={this.handlerFilter.delete}
                        />
                    </Panel>
                    <Panel header="프로세서" key="2">
                        <ProcessorContainer
                            processor={this.state.processor}
                            onSave={this.handlerProcessor.edit}
                            onDelete={this.handlerProcessor.delete}
                        />
                    </Panel>
                </Collapse>

                <PluginContainer
                    plugin={this.state.plugin}
                    action={this.state.action}
                    onPluginSave={this.handlerPlugin}
                    onSave={this.handlerAction.edit}
                    onDelete={this.handlerAction.delete}
                />

            </CommonModal>
        );
    }
}

export default AddRuleModal;
